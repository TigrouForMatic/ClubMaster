import React, { useState, useMemo, useEffect } from 'react';
import Modal from 'react-modal';
import api from '../../js/App/Api';
import useStore from '../../store/store';

function ModaleInfoBanner({ isOpen, onClose, infoBanner = null }) {
  const { currentUserRoles, userClubs, currentUser } = useStore();
  const addItem = useStore((state) => state.addItem);
  const updateItem = useStore((state) => state.updateItem);
  const [selectedClubId, setSelectedClubId] = useState(infoBanner?.clubid || userClubs[0]?.id);

  const [bannerData, setBannerData] = useState({
    title: infoBanner?.title || '',
    description: infoBanner?.description || '',
    headerimage: infoBanner?.headerimage || '',
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
      } else {
        response = await api.post('/infobanner', finalBannerData);
        response.clublabel = userClubs.find(club => club.id === selectedClubId).label;
        response.createdbyname = currentUser.name;
        addItem('infoBanners', response);
      }

      handleClose();
    } catch (error) {
      console.error('Erreur lors de la création/modification de l\'infoBanner:', error);
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
      className="relative bg-white rounded-lg shadow-lg w-full max-w-3xl mx-auto mt-10 max-h-[90vh] overflow-y-auto p-6"
      overlayClassName="fixed inset-0 bg-black/50 z-50 flex items-start justify-center"
    >
      <div className="space-y-6">
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
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Sélectionner un club</h3>
            <div className="flex flex-wrap gap-2">
              {filteredClubs.map(club => (
                <button
                  key={club.id}
                  onClick={() => handleClubSelect(club.id)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    selectedClubId === club.id
                      ? 'bg-black text-white'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {club.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Titre
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={bannerData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md border-input bg-background text-sm"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={bannerData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md border-input bg-background text-sm min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="headerimage" className="text-sm font-medium">
              Image d'en-tête (URL)
            </label>
            <input
              type="url"
              id="headerimage"
              name="headerimage"
              value={bannerData.headerimage}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md border-input bg-background text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="dd" className="text-sm font-medium">
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
                className="w-full px-3 py-2 border rounded-md border-input bg-background text-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="df" className="text-sm font-medium">
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
                className="w-full px-3 py-2 border rounded-md border-input bg-background text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md text-sm font-medium bg-black text-white hover:bg-black/90"
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