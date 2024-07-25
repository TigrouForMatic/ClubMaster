import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import api from '../../js/App/Api';
import { useStore } from '../../store/store';
import styles from "../../styles/Modale.module.css";

function ModalEditEvent({ isOpen, onClose, eventId }) {
  const login = useStore((state) => state.login);
  const updateItem = useStore((state) => state.updateItem);

  const [eventData, setEventData] = useState({
    Label: '',
    Description: '',
    EventTypeId: '',
    Dd: '',
    Df: '',
    AddressId: '',
    MaxPerson: '',
  });

  useEffect(() => {
    if (isOpen && eventId) {
      fetchEventData();
    }
  }, [isOpen, eventId]);

  const fetchEventData = async () => {
    try {
      const response = await api.get(`/event/${eventId}`, {
        headers: { Authorization: `Bearer ${login.token}` }
      });
      setEventData(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données de l\'événement:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const editedEventData = await api.put(`/event/${eventId}`, eventData, {
        headers: { Authorization: `Bearer ${login.token}` }
      });
      updateItem('events', editedEventData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'événement:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <h2>Modifier l'événement</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="Label">Libellé :</label>
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
          <label htmlFor="EventTypeId">Type d'événement :</label>
          <input
            type="number"
            id="EventTypeId"
            name="EventTypeId"
            value={eventData.EventTypeId}
            onChange={handleChange}
          />
        </div>
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
        <div>
          <label htmlFor="AddressId">Adresse :</label>
          <input
            type="number"
            id="AddressId"
            name="AddressId"
            value={eventData.AddressId}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="MaxPerson">Nombre maximum de personnes :</label>
          <input
            type="number"
            id="MaxPerson"
            name="MaxPerson"
            value={eventData.MaxPerson}
            onChange={handleChange}
          />
        </div>
        <div>
          <button type="submit">Enregistrer les modifications</button>
          <button type="button" onClick={onClose}>Annuler</button>
        </div>
      </form>
    </Modal>
  );
}

export default ModalEditEvent;

{/* <ModalEditEvent 
  isOpen={modalIsOpen} 
  onClose={() => setModalIsOpen(false)} 
  eventId={selectedEventId} 
/> */}