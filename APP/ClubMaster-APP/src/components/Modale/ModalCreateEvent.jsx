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
  const [hasRecurrence, setHasRecurrence] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState('specific');
  const [recurrenceDates, setRecurrenceDates] = useState([]);
  const [recurrenceEndDate, setRecurrenceEndDate] = useState(null);

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

  // Fonction pour extraire la date et l'heure d'un datetime
  const splitDateTime = (datetime) => {
    if (!datetime) return { date: '', time: '' };
    const [date, time] = datetime.split('T');
    return { date, time };
  };

  // Fonction pour mettre à jour Dd et Df
  const updateDateTime = (type, value, field) => {
    const currentDateTime = type === 'Dd' ? eventData.Dd : eventData.Df;
    const { date, time } = splitDateTime(currentDateTime || '');
    
    const newDateTime = field === 'date' 
      ? `${value}T${time || '00:00'}`
      : `${date || new Date().toISOString().split('T')[0]}T${value}`;

    setEventData(prevData => ({
      ...prevData,
      [type]: newDateTime
    }));
  };

  // Modifier le handleChange pour les nouveaux champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'startDate' || name === 'startTime') {
      updateDateTime('Dd', value, name === 'startDate' ? 'date' : 'time');
    } else if (name === 'endDate' || name === 'endTime') {
      updateDateTime('Df', value, name === 'endDate' ? 'date' : 'time');
    } else {
      setEventData(prevData => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const date = eventData.Dd.split('T')[0];
      const finalEventData = {
        ...eventData,
        Dd: `${date}T${splitDateTime(eventData.Dd).time}`,
        Df: `${date}T${splitDateTime(eventData.Df).time}`,
        Recurrence: hasRecurrence ? {
          type: recurrenceType,
          dates: recurrenceDates,
          endDate: recurrenceEndDate
        } : null
      };

      const response = await api.post('/event', finalEventData, {
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

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 5) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        const time = `${formattedHour}:${formattedMinute}`;
        options.push(
          <option key={time} value={time}>
            {time}
          </option>
        );
      }
    }
    return options;
  };

  const generateHourOptions = () => {
    return Array.from({ length: 24 }, (_, i) => {
      const hour = i.toString().padStart(2, '0');
      return (
        <option key={hour} value={hour}>
          {hour}
        </option>
      );
    });
  };

  const generateMinuteOptions = () => {
    return Array.from({ length: 12 }, (_, i) => {
      const minute = (i * 5).toString().padStart(2, '0');
      return (
        <option key={minute} value={minute}>
          {minute}
        </option>
      );
    });
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    const isStart = name.startsWith('startTime');
    const type = isStart ? 'Dd' : 'Df';
    const currentTime = splitDateTime(eventData[type]).time || '00:00';
    const [currentHour, currentMinute] = currentTime.split(':');
    
    let newTime;
    if (name.endsWith('Hour')) {
      newTime = `${value}:${currentMinute}`;
    } else {
      newTime = `${currentHour}:${value}`;
    }

    updateDateTime(type, newTime, 'time');
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
        <div className={styles.dateTimeSection}>
          <div className={styles.dateTimeBlock}>
            <div className={styles.dateTimeContainer}>
              <div className={styles.inputGroup}>
                <label>Date</label>
                <div className={styles.dateInput}>
                  <input
                    type="date"
                    name="Date"
                    value={splitDateTime(eventData.Dd).date || new Date().toISOString().split('T')[0]}
                    onChange={handleChange}
                    min={new Date().toLocaleDateString('fr-CA')}
                    required
                  />
                </div>
              </div>
              
              <div className={styles.timeGroup}>
                <label>Horaires</label>
                <div className={styles.timeInputs}>
                  <span>de</span>
                  <input aria-label="Time" type="time" value={eventData.Dd} onChange={handleChange} />
                  <span>à</span>
                  <input aria-label="Time" type="time" value={eventData.Df} onChange={handleChange} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.maxPersonContainer}>
          <label className={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={hasRecurrence}
              onChange={() => setHasRecurrence(!hasRecurrence)}
              className={styles.toggleInput}
            />
            <span className={styles.toggleSlider}></span>
            Événement récurrent
          </label>
          
          {hasRecurrence && (
            <div className={styles.recurrenceContainer}>
              <select
                value={recurrenceType}
                onChange={(e) => setRecurrenceType(e.target.value)}
              >
                <option value="specific">Dates spécifiques</option>
                <option value="weekly">Hebdomadaire</option>
              </select>
              
              {recurrenceType === 'specific' ? (
                <div>
                  <input
                    type="date"
                    multiple
                    onChange={(e) => {
                      const dates = Array.from(e.target.selectedOptions).map(opt => opt.value);
                      setRecurrenceDates(dates);
                    }}
                  />
                </div>
              ) : (
                <div>
                  <select
                    multiple
                    onChange={(e) => {
                      const days = Array.from(e.target.selectedOptions).map(opt => opt.value);
                      setRecurrenceDates(days);
                    }}
                  >
                    <option value="1">Lundi</option>
                    <option value="2">Mardi</option>
                    <option value="3">Mercredi</option>
                    <option value="4">Jeudi</option>
                    <option value="5">Vendredi</option>
                    <option value="6">Samedi</option>
                    <option value="0">Dimanche</option>
                  </select>
                  <input
                    type="date"
                    value={recurrenceEndDate || ''}
                    onChange={(e) => setRecurrenceEndDate(e.target.value)}
                    placeholder="Date de fin de récurrence"
                  />
                </div>
              )}
            </div>
          )}
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
