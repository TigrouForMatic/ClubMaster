import React, { useState } from 'react';
import Modal from 'react-modal';
import api from '../../js/App/Api';
import { useStore } from '../../store/store';
import styles from "../../styles/Modale.module.css";

function ModalCreateEvent({ isOpen, onClose }) {
  const currentUser = useStore((state) => state.currentUser);
  const addItem = useStore((state) => state.addItem);

  const [eventData, setEventData] = useState({
    Label: '',
    Description: '',
    EventTypeId: '',
    Dd: '',
    Df: '',
    AddressId: '',
    MaxPerson: '',
  });

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
      addItem('events', response.data);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création de l\'événement:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <h2>Créer un nouvel événement</h2>
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
          <button type="submit">Créer l'événement</button>
          <button type="button" onClick={onClose}>Annuler</button>
        </div>
      </form>
    </Modal>
  );
}

export default ModalCreateEvent;

// <ModalCreateEvent 
//   isOpen={modalIsOpen} 
//   onClose={() => setModalIsOpen(false)}
// />