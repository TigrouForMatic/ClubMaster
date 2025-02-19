import React, { useState, useMemo, useEffect } from 'react';
import Modal from 'react-modal';
import api from '../../js/App/Api';
import useStore from '../../store/store';
import InfoBannerPhotoUploader from '../InfoBanner/InfoBannerPhotoUploader';

function ModaleInfoBanner({ isOpen, onClose, infoBanner = null }) {
  const { currentUserRoles, userClubs, currentUser } = useStore();
  const addItem = useStore((state) => state.addItem);
  const updateItem = useStore((state) => state.updateItem);
  const [selectedClubId, setSelectedClubId] = useState(infoBanner?.clubid || userClubs[0]?.id);

  const [preview, setPreview] = useState(null);

  const [file, setFile] = useState(null);

  const [bannerData, setBannerData] = useState({
    title: infoBanner?.title || '',
    description: infoBanner?.description || '',
    dd: infoBanner?.dd ? new Date(infoBanner.dd).toISOString().split('T')[0] : '',
    df: infoBanner?.df ? new Date(infoBanner.df).toISOString().split('T')[0] : '',
  });

  const filteredClubs = useMemo(() => {
    const highLevelClubIds = new Set(
      currentUserRoles
        .filter(role => role.level >= 3)
        .map(role => role.clubid)
    );
    return userClubs.filter(club => highLevelClubIds.has(club.id));
  }, [userClubs, currentUserRoles]);

  const handleClubSelect = (clubId) => {
    setSelectedClubId(clubId);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBannerData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (!file) return;

    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleFileSelect = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setFile(file);
      setPreview(URL.createObjectURL(file));
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
      setError('Erreur lors de l\'upload de la photo');
      console.error(error);
      throw error;
    }
  };

  const handleClose = () => {
    setBannerData({
        title: '',
        description: '',
        headerimage: '',
        dd: '',
        df: '',
    });
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
      onRequestClose={onClose}
      contentLabel="Gestion des annonces"
      className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl mx-auto mt-10 max-h-[90vh] overflow-y-auto scrollbar-hide"
      overlayClassName="fixed inset-0 bg-black/50 z-50 flex items-start justify-center"
    >
      <div className="p-6">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            {infoBanner ? "Modifier l'annonce" : "Créer une nouvelle annonce"}
          </h2>
          <button 
            onClick={onClose}
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

          <div className="space-y-2">
            <label htmlFor="headerimage" className="block text-sm font-medium text-zinc-700">
              Image d'en-tête
            </label>
            <InfoBannerPhotoUploader 
              onFileSelect={setFile}
              initialPreview={preview}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="dd" className="block text-sm font-medium text-zinc-700">
                Date d'annonce
              </label>
              <input
                type="date"
                id="dd"
                name="dd"
                value={bannerData.dd}
                onChange={handleChange}
                min={!infoBanner ? new Date().toISOString().split('T')[0] : undefined}
                required
                className="w-full px-3 py-2 border rounded-md border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
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

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
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