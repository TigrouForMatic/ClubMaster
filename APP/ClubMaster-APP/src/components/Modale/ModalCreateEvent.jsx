import React, { useState, useMemo } from 'react';
import Modal from 'react-modal';
import api from '../../js/App/Api';
import useStore from '../../store/store';
import styles from "../../styles/ModaleCreateEvent.module.css";

function ModalCreateEvent({ isOpen, onClose }) {
  const { currentUser, currentUserRoles, userClubs, addresses, typesEvent } = useStore();
  const addItem = useStore((state) => state.addItem);
  const [selectedClubId, setSelectedClubId] = useState(userClubs[0].id);
  const [hasMaxPerson, setHasMaxPerson] = useState(false);

  const [eventData, setEventData] = useState({
    Label: '',
    Description: '',
    EventTypeId: null,
    Dd: null,
    Df: null,
    AddressId: null,
    MaxPerson: null,
  });

  const filteredClubs = useMemo(() => {
    const highLevelClubIds = new Set(
      currentUserRoles
        .filter(role => role.level >= 3)
        .map(role => role.clubid)
    );

    return userClubs.filter(club => highLevelClubIds.has(club.id));
  }, [userClubs, currentUserRoles]);

  const filteredTypes = useMemo(() => {
    return typesEvent.filter(type => selectedClubId ? type.clubid === selectedClubId : true);
  }, [typesEvent, selectedClubId]);

  const handleClubSelect = (clubId) => {
    setSelectedClubId(clubId);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/event', eventData, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      addItem('events', response);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création de l\'événement:', error);
    }
  };

  const eventTypeSorted = filteredTypes.sort((a, b) => a.label.localeCompare(b.label));

  const handleToggleMaxPerson = () => {
    setHasMaxPerson(!hasMaxPerson);
    if (!hasMaxPerson) {
      setEventData(prevData => ({ ...prevData, MaxPerson: null }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={styles.modal}
      overlayClassName={styles.modalOverlay}
    >
      <h2 className={styles.title}>Créer un nouvel événement</h2>

      {filteredClubs.length > 1 && (
        <ClubList clubs={filteredClubs} selectedClubId={selectedClubId} onClubSelect={handleClubSelect} />
      )}

      <form onSubmit={handleSubmit} className={styles.content}>
        <div>
          <label htmlFor="EventTypeId">Type d'événement :</label>
          <select
            id="EventTypeId"
            name="EventTypeId"
            value={eventData.EventTypeId}
            onChange={handleChange}
          >
            <option value="">Sélectionnez un type d'événement</option>
            {eventTypeSorted.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="Label">Nom de l'événement :</label>
          <input
            type="text"
            id="Label"
            name="Label"
            value={eventData.Label}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="Description">Description :</label>
          <textarea
            id="Description"
            name="Description"
            value={eventData.Description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="AddressId">Adresse :</label>
          <select
            id="AddressId"
            name="AddressId"
            value={eventData.AddressId}
            onChange={handleChange}
          >
            <option value="">Sélectionnez une adresse</option>
            {addresses.map((address) => (
              <option key={address.id} value={address.id}>
                {`${address.street}, ${address.postalcode} ${address.city}`}
              </option>
            ))}
          </select>
        </div>
        <hr />
        <div>
          <label htmlFor="Dd">Date de début :</label>
          <input
            type="datetime-local"
            id="Dd"
            name="Dd"
            value={eventData.Dd}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="Df">Date de fin :</label>
          <input
            type="datetime-local"
            id="Df"
            name="Df"
            value={eventData.Df}
            onChange={handleChange}
          />
        </div>
        <hr />
        <div className={styles.maxPersonContainer}>
          <label className={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={hasMaxPerson}
              onChange={handleToggleMaxPerson}
              className={styles.toggleInput}
            />
            <span className={styles.toggleSlider}></span>
            Limiter le nombre de participants
          </label>
          
          {hasMaxPerson && (
            <div>
              <input
                type="number"
                id="MaxPerson"
                name="MaxPerson"
                value={eventData.MaxPerson || ''}
                onChange={handleChange}
                placeholder="Nombre maximum de participants"
                min="1"
              />
            </div>
          )}
        </div>
        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.registerButton}>Créer l'événement</button>
          <button type="button" onClick={onClose} className={styles.unregisterButton}>Annuler</button>
        </div>
      </form>
      <button onClick={onClose} className={styles.closeButton}>&times;</button>
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

export default ModalCreateEvent;


// <ModalCreateEvent 
//   isOpen={modalIsOpen} 
//   onClose={() => setModalIsOpen(false)}
// />
