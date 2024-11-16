import React, { useState, useMemo } from 'react';
import Modal from 'react-modal';
import api from '../../js/App/Api';
import useStore from '../../store/store';
import styles from "../../styles/ModaleCreateEvent.module.css";
import { dateFormat } from '../../js/date';

function ModalCreateEvent({ isOpen, onClose }) {
  const { currentUserRoles, userClubs, addresses, typesEvent } = useStore();
  const addItem = useStore((state) => state.addItem);
  const addItems = useStore((state) => state.addItems);
  const [selectedClubId, setSelectedClubId] = useState(userClubs[0].id);
  const [hasMaxPerson, setHasMaxPerson] = useState(false);
  const [hasRecurrence, setHasRecurrence] = useState(false);
  const [recurrenceEndDate, setRecurrenceEndDate] = useState('');
  const [recurrenceInterval, setRecurrenceInterval] = useState(1);
  const [recurrenceUnit, setRecurrenceUnit] = useState('jours');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

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
        Recurrence: hasRecurrence ? {
          interval: recurrenceInterval,
          unit: recurrenceUnit,
          endDate: recurrenceEndDate
        } : null
      };

      const response = await api.post('/event', finalEventData);

      if (Array.isArray(response) && response.length > 0) {
        addItems('events', response);
        const eventIds = response.map(event => event.id);
        try {
          const responseConversations = await api.post('/conversation', {
            eventIds: eventIds,
            type: 'Event'
          });
          addItems('conversations', responseConversations);
        } catch (error) {
          console.error('Erreur lors de la création des conversations:', error);
        }
      } else if (response && typeof response === 'object') {
        addItem('events', response);
        try {
          const responseConversations = await api.post('/conversation', {
            eventId: response.id,
            type: 'Event'
          });
          addItem('conversations', responseConversations);
        } catch (error) {
          console.error('Erreur lors de la création des conversations:', error);
        }
      }
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
    setHasRecurrence(false);
    setHasMaxPerson(false);
    setRecurrenceEndDate('');
    setRecurrenceInterval(1);
    setRecurrenceUnit('jours');
    onClose();
  };

  const eventTypeSorted = filteredTypes.sort((a, b) => a.label.localeCompare(b.label));

  const handleToggleMaxPerson = () => {
    setHasMaxPerson(!hasMaxPerson);
    if (!hasMaxPerson) {
      setEventData(prevData => ({ ...prevData, MaxPerson: null }));
    }
  };

  const getRecurrenceResume = () => {
    if (!recurrenceEndDate) {
      return '';
    }
    const endDate = dateFormat(recurrenceEndDate);
    const dayOfWeek = new Date(recurrenceEndDate).toLocaleDateString('fr-FR', { weekday: 'long' });
    const displayEndDate = `${dayOfWeek} ${endDate}`;
    if (recurrenceUnit === 'jours') {
      if (recurrenceInterval === 1) {
        return `Tous les jours jusqu'au ${displayEndDate}`;
      } else {
        return `Tous les ${recurrenceInterval} jours jusqu'au ${displayEndDate}`;
      }
    } else if (recurrenceUnit === 'semaines') {
      if (recurrenceInterval === 1) {
        return `Tous les semaines jusqu'au ${displayEndDate}`;
      } else {
        return `Tous les ${recurrenceInterval} semaines jusqu'au ${displayEndDate}`;
      }
    } else if (recurrenceUnit === 'mois') {
      if (recurrenceInterval === 1) {
        return `Tous les mois jusqu'au ${displayEndDate}`;
      } else {
        return `Tous les ${recurrenceInterval} mois jusqu'au ${displayEndDate}`;
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      className={styles.modal}
      overlayClassName={styles.modalOverlay}
    >
      <div className={styles.headerModal}>
        <h2 className={styles.title}>Créer un nouvel événement</h2>
        <button onClick={handleClose} className={styles.closeButton}>&times;</button>
      </div>

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
              checked={hasRecurrence}
              onChange={() => setHasRecurrence(!hasRecurrence)}
              className={styles.toggleInput}
            />
            <span className={styles.toggleSlider}></span>
            Événement récurrent
          </label>
          
          {hasRecurrence && (
            <div className={styles.recurrenceContainer}>
              <div className={styles.recurrenceInputs}>
                <span className={styles.recurrenceText}>Tous les</span>
                <input 
                  type="number" 
                  value={recurrenceInterval} 
                  onChange={(e) => setRecurrenceInterval(parseInt(e.target.value) || 1)}
                  min="1" 
                  className={styles.recurrenceInput}
                />
                <select 
                  value={recurrenceUnit}
                  onChange={(e) => setRecurrenceUnit(e.target.value)}
                  className={styles.recurrenceSelect}
                >
                  <option value='jours'>jours</option>
                  <option value='semaines'>semaines</option>
                  <option value='mois'>mois</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label>Date du dernier événement</label>
                <div className={styles.dateInput}>
                  <input
                    type="date"
                    name="recurrenceEndDate"
                    value={recurrenceEndDate || ''}
                    onChange={(e) => setRecurrenceEndDate(e.target.value)}
                    min={eventData.Dd ? eventData.Dd.split('T')[0] : new Date().toISOString().split('T')[0]}
                    required={hasRecurrence}
                    className={styles.recurrenceEndDateInput}
                  />
                </div>
              </div>
              { getRecurrenceResume() && (
                <span className={styles.recurrenceResume}> {getRecurrenceResume()}</span>
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
          <button type="button" onClick={handleClose} className={styles.unregisterButton}>Annuler</button>
          <button type="submit" className={styles.registerButton}>Créer l'événement</button>
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

export default ModalCreateEvent;


// <ModalCreateEvent 
//   isOpen={modalIsOpen} 
//   onClose={() => setModalIsOpen(false)}
// />
