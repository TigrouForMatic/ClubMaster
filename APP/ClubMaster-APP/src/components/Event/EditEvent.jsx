import React, { useState, useMemo } from 'react';   
import api from '../../js/App/Api';
import useStore from '../../store/store';
import styles from "../../styles/ModaleCreateEvent.module.css";

function EditEvent({ event, onClose }) {    
  const { currentUserRoles, userClubs, addresses, typesEvent } = useStore();
  const updateItem = useStore((state) => state.updateItem);
  const [selectedClubId, setSelectedClubId] = useState(typesEvent.find(type => type.id === event.eventtypeid)?.clubid);
  const [startDate, setStartDate] = useState(event.dd.split('T')[0]);
  const [startTime, setStartTime] = useState(event.dd.split('T')[1].slice(0, 5));
  const [endTime, setEndTime] = useState(event.df.split('T')[1].slice(0, 5));
  const [hasMaxPerson, setHasMaxPerson] = useState(event.maxperson ? true : false);

  const [eventData, setEventData] = useState({
    Label: event.label,
    Description: event.description,
    EventTypeId: event.eventtypeid,
    Dd: event.dd,
    Df: event.df,
    AddressId: event.addressid,
    MaxPerson: event.maxperson,
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

  // Modifier le handleChange pour les nouveaux champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'startTime') {
      setStartTime(value);
    } else if (name === 'endTime') {
      setEndTime(value);
    } else {
      setEventData(prevData => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const date = startDate || new Date().toISOString().split('T')[0];
      const finalEventData = {
        ...eventData,
        Dd: new Date(`${date}T${startTime}`).toISOString(),
        Df: new Date(`${date}T${endTime === '' ? startTime : endTime}`).toISOString(),
      };

      const response = await api.put(`/event/${event.id}`, finalEventData);
      updateItem('events', event.id, response);
      handleClose();
    } catch (error) {
      console.error('Erreur lors de la création de l\'événement:', error);
    }
  };

  const handleClose = () => {
    // Reset the form
    setEventData({
      Label: '',
      Description: '',
      EventTypeId: null,
      Dd: null,
      Df: null,
      AddressId: null,
      MaxPerson: null,
    });
    setStartDate('');
    setStartTime('');
    setEndTime('');
    onClose();
  };

  const eventTypeSorted = filteredTypes.sort((a, b) => a.label.localeCompare(b.label));

  const handleToggleMaxPerson = () => {
    setHasMaxPerson(!hasMaxPerson);
    if (!hasMaxPerson) {
      setEventData(prevData => ({ ...prevData, MaxPerson: null }));
    }
  };

  return (
    <div style={{margin: "2em"}}>
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
        <div className={styles.dateTimeSection}>
          <div className={styles.dateTimeBlock}>
            <div className={styles.dateTimeContainer}>
              <div className={styles.inputGroup}>
                <label>Date</label>
                <div className={styles.dateInput}>
                  <input
                    type="date"
                    name="startDate"
                    value={startDate || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toLocaleDateString('fr-CA')}
                    placeholder="Date de début"
                    required
                  />
                </div>
              </div>
              
              <div className={styles.timeGroup}>
                <label>Horaires</label>
                <div className={styles.timeInputs}>
                  <span>de</span>
                  <input aria-label="Time" type="time" name="startTime" value={startTime} max={eventData.Df} onChange={handleChange} required/>
                  <span>à</span>
                  <input aria-label="Time" type="time" name="endTime" value={endTime} min={eventData.Dd} onChange={handleChange} />
                </div>
              </div>
            </div>
          </div>
        </div>
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
          <button type="button" onClick={handleClose} className={styles.unregisterButton}>Annuler</button>
          <button type="submit" className={styles.registerButton}>Modifier l'événement</button>
        </div>
      </form>
    </div>
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

export default EditEvent;