import React from 'react';
import styles from "../../styles/Modale.module.css";

const ModalInfoEvent = ({ isOpen, onClose, event }) => {
  if (!isOpen || !event) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>{event.label}</h2>
        <p><strong>Date de début:</strong> {new Date(event.dd).toLocaleString()}</p>
        <p><strong>Date de fin:</strong> {new Date(event.df).toLocaleString()}</p>
        <p><strong>Description:</strong> {event.description}</p>
        <p><strong>Type d'événement:</strong> {event.eventtypeid}</p>
        <p><strong>ID de l'adresse:</strong> {event.addressid}</p>
        <p><strong>ID de l'événement:</strong> {event.id}</p>
        <p><strong>Maximum d'inscription:</strong> {event.MaxPerson || "Aucun"}</p>
        <button onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
};

export default ModalInfoEvent;