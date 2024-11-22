import React, { useState, useMemo, useEffect } from 'react';
import Modal from 'react-modal';
import api from '../../js/App/Api';
import useStore from '../../store/store';
import styles from "../../styles/ModaleCreateEvent.module.css";

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
      onRequestClose={handleClose}
      className={styles.modal}
      overlayClassName={styles.modalOverlay}
    >
      <div className={styles.headerModal}>
        <h2 className={styles.title}>
          {infoBanner ? "Modifier l'annonce" : "Créer une nouvelle annonce"}
        </h2>
        <button onClick={handleClose} className={styles.closeButton}>&times;</button>
      </div>

      {filteredClubs.length > 1 && (
        <ClubList clubs={filteredClubs} selectedClubId={selectedClubId} onClubSelect={handleClubSelect} />
      )}

      <form onSubmit={handleSubmit} className={styles.content}>
        <div>
          <label htmlFor="title">Titre :</label>
          <input
            type="text"
            id="title"
            name="title"
            value={bannerData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Description :</label>
          <textarea
            id="description"
            name="description"
            value={bannerData.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="headerimage">Image d'en-tête (URL) :</label>
          <input
            type="url"
            id="headerimage"
            name="headerimage"
            value={bannerData.headerimage}
            onChange={handleChange}
          />
        </div>

        {infoBanner ? 
        <div>
          <label htmlFor="dd">Date d'annonce :</label>
          <input
            type="date"
            id="dd"
            name="dd"
            value={bannerData.dd}
            onChange={handleChange}
            required
          />
        </div> : 
        <div>
            <label htmlFor="dd">Date d'annonce :</label>
            <input
              type="date"
              id="dd"
              name="dd"
              value={bannerData.dd}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
        }

        <div>
          <label htmlFor="df">Date de fin :</label>
          <input
            type="date"
            id="df"
            name="df"
            value={bannerData.df}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className={styles.buttonContainer}>
          <button type="button" onClick={handleClose} className={styles.unregisterButton}>
            Annuler
          </button>
          <button type="submit" className={styles.registerButton}>
            {infoBanner ? "Modifier" : "Créer"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

const ClubList = React.memo(({ clubs, selectedClubId, onClubSelect }) => (
  <div className={styles.section}>
    <div className={styles.sectionHeader}>
      <h2 className={styles.subtitle}>Clubs</h2>
    </div>
    <div className={styles.clubList}>
      {clubs.map(club => (
        <div
          key={club.id}
          className={`${styles.clubItem} ${selectedClubId === club.id ? styles.active : ""}`}
          onClick={() => onClubSelect(club.id)}
        >
          {club.label}
        </div>
      ))}
    </div>
  </div>
));

export default ModaleInfoBanner;