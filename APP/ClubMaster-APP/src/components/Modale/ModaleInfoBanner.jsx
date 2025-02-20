import React, { useState, useMemo, useEffect } from 'react';
import Modal from 'react-modal';
import api from '../../js/App/Api';
import useStore from '../../store/store';
import Select from 'react-select';
import InfoBannerPhotoUploader from '../InfoBanner/InfoBannerPhotoUploader';

Modal.setAppElement('#root');

function ModaleInfoBanner({ isOpen, onClose, infoBanner = null }) {
  const { currentUserRoles, userClubs, currentUser, events, typesEvent } = useStore();
  const addItem = useStore((state) => state.addItem);
  const updateItem = useStore((state) => state.updateItem);
  const [selectedClubId, setSelectedClubId] = useState(infoBanner?.clubid || userClubs[0]?.id);
  const [hasEvent, setHasEvent] = useState(false);
  const [hasHeaderImage, setHasHeaderImage] = useState(false);

  const [preview, setPreview] = useState(null);

  const [file, setFile] = useState(null);

  const [bannerData, setBannerData] = useState({
    title: infoBanner?.title || '',
    description: infoBanner?.description || '',
    dd: infoBanner?.dd ? new Date(infoBanner.dd).toISOString().split('T')[0] : '',
    df: infoBanner?.df ? new Date(infoBanner.df).toISOString().split('T')[0] : '',
    eventid: infoBanner?.eventid || null,
  });

  useEffect(() => {
    if (infoBanner?.photo) {
      setHasHeaderImage(true);
      const API_URL = import.meta.env.VITE_API_URL_UPLOADS_PATH;
      const photoUrl = `${API_URL}${infoBanner.photo.url}`;
      setFile(infoBanner.photo);
      setPreview(photoUrl);
    }
    if (infoBanner?.eventid) {
      setHasEvent(true);
      setBannerData(prevData => ({ ...prevData, eventid: infoBanner.eventid }));
    }
  }, [infoBanner]);

  const filteredClubs = useMemo(() => {
    const highLevelClubIds = new Set(
      currentUserRoles
        .filter(role => role.level >= 3)
        .map(role => role.clubid)
    );
    return userClubs.filter(club => highLevelClubIds.has(club.id));
  }, [userClubs, currentUserRoles]);

  const filteredEvents = useMemo(() => {
    const eventTypes = typesEvent.filter(type => type.clubid == selectedClubId);
    const filteredEvents = events.filter(event => eventTypes.filter(type => type.id == event.eventtypeid));
    return filteredEvents.map(event => ({
      value: event.id,
      label: "#" + event.id + ' : ' + event.label
    }));
  }, [events, selectedClubId, typesEvent]);

  const handleClubSelect = (clubId) => {
    setSelectedClubId(clubId);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBannerData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const finalBannerData = {
        ...bannerData,
        clubid: selectedClubId,
        createdby: infoBanner?.createdby || currentUser.id,
      };

      let response;
      if (infoBanner) {
        response = await api.put(`/infobanner/${infoBanner.id}`, finalBannerData);
        updateItem('infoBanners', response);
        await uploadFile(infoBanner.id);

      } else {
        response = await api.post('/infobanner', finalBannerData);
        response.clublabel = userClubs.find(club => club.id === selectedClubId).label;
        response.createdbyname = currentUser.name;
        addItem('infoBanners', response);
        await uploadFile(response.id);
      }

      handleClose();
    } catch (error) {
      console.error('Erreur lors de la création/modification de l\'infoBanner:', error);
    }
  };

  const uploadFile = async (referenceId) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('referenceid', referenceId);
    formData.append('referencetype', 'infobanner');
    formData.append('clubid', selectedClubId);
    
    try {
      const response = await api.post('/photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          // Vous pouvez ajouter ici un état pour afficher la progression
        }
      });
      
      addItem('photos', response);
    } catch (error) {
      console.error('Erreur lors de l\'upload de la photo', error);
      throw error;
    }
  };

  const handleSelectEvent = (eventId) => {
    setBannerData(prevData => ({ ...prevData, eventid: eventId }));
  };

  const handleClose = () => {
    setBannerData({
        title: '',
        description: '',
        headerimage: '',
        dd: '',
        df: '',
        eventid: null,
    });
    setHasEvent(false);
    setHasHeaderImage(false);
    setFile(null);
    setPreview(null);
    onClose();
  };

  useEffect(() => {
    if (infoBanner) {
      setBannerData({
        title: infoBanner?.title || '',
        description: infoBanner?.description || '',
        headerimage: infoBanner?.headerimage || '',
        dd: infoBanner?.dd ? new Date(infoBanner.dd).toISOString().split('T')[0] : '',
        df: infoBanner?.df ? new Date(infoBanner.df).toISOString().split('T')[0] : '',
      });
    }
  }, [infoBanner]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      contentLabel="Gestion des annonces"
      ariaHideApp={false}
      className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl mx-auto mt-10 max-h-[90vh] overflow-y-auto scrollbar-hide"
      overlayClassName="fixed inset-0 bg-black/50 z-50 flex items-start justify-center"
    >
      <div className="p-6">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            {infoBanner ? "Modifier l'annonce" : "Créer une nouvelle annonce"}
          </h2>
          <button 
            onClick={handleClose}
            className="text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        {filteredClubs.length > 1 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Clubs</h3>
            <div className="flex flex-wrap gap-2">
              {filteredClubs.map(club => (
                <button
                  key={club.id}
                  onClick={() => handleClubSelect(club.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                    ${selectedClubId === club.id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'
                    }`}
                >
                  {club.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">

          <div className="">
            <label className="flex items-center gap-2 w-80 h-10">
              <input
                type="checkbox"
                checked={hasHeaderImage}
                onChange={(e) => setHasHeaderImage(e.target.checked)}
                className="w-4 h-4 rounded border-blue-500"
              />
              <span className="text-sm font-medium">Ajouter une image d'en-tête</span>
            </label>
          </div>
        {hasHeaderImage && (
          <div className="space-y-2">
            <InfoBannerPhotoUploader 
              onFileSelect={setFile}
              initialPreview={preview}
            />
          </div>
        )}

          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-zinc-700">
              Titre
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={bannerData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-zinc-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={bannerData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 relative group">
              <label htmlFor="dd" className="block text-sm font-medium text-zinc-700">
                Date d'annonce
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="dd"
                  name="dd"
                  value={bannerData.dd}
                  onChange={handleChange}
                  min={!infoBanner ? new Date().toISOString().split('T')[0] : undefined}
                  required
                  disabled={infoBanner ? new Date(infoBanner.dd) < new Date() : false}
                  className="w-full px-3 py-2 border rounded-md border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {infoBanner && new Date(infoBanner.dd) < new Date() && (
                  <div className="absolute left-0 -bottom-10 hidden group-hover:block bg-blue-500 text-white text-sm rounded px-2 py-1 w-75">
                    La date d'annonce ne peut pas être modifiée car l'annonce a déjà commencé
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="df" className="block text-sm font-medium text-zinc-700">
                Date de fin
              </label>
              <input
                type="date"
                id="df"
                name="df"
                value={bannerData.df}
                onChange={handleChange}
                min={bannerData.dd}
                required
                className="w-full px-3 py-2 border rounded-md border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 w-80 h-10">
              <input
                type="checkbox"
                checked={hasEvent}
                onChange={(e) => setHasEvent(e.target.checked)}
                className="w-4 h-4 rounded border-blue-500"
              />
              <span className="text-sm font-medium">Associez un événement</span>
            </label>
            {hasEvent && (
              <Select
                value={bannerData.eventid ? { value: bannerData.eventid, label: events.find(e => e.id == bannerData.eventid)?.label } : null}
                onChange={(option) => handleSelectEvent(option ? option.value : null)}
                options={filteredEvents}
                placeholder="Sélectionner un événement"
                className="react-select-container w-80"
                classNamePrefix="react-select"
                isClearable
              />
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-md shadow-sm hover:bg-zinc-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
            >
              {infoBanner ? "Modifier" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default ModaleInfoBanner;