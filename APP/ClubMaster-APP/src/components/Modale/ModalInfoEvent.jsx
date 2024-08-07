import React, { useCallback, useMemo, useEffect, useState } from 'react';
import useStore from '../../store/store';
import api from '../../js/App/Api';
import { dateToTimeFormat, dateFormat } from '../../js/date';
import styles from "../../styles/Modale.module.css";
import { Xmark } from 'iconoir-react';

const ModalInfoEvent = ({ isOpen, onClose, event }) => {
  if (!isOpen || !event) return null;

  const [inscription, setInscription] = useState(null);
  const { addItem, deleteItem, addresses, typesEvent, inscriptions, currentUser } = useStore();

  const type = useMemo(() => typesEvent.find(e => e.id === event.eventtypeid) || {}, [typesEvent, event.eventtypeid]);
  const address = useMemo(() => addresses.find(e => e.id === event.addressid) || {}, [addresses, event.addressid]);

  const displayDate = useMemo(() => 
    `Le ${dateFormat(event.dd)} de ${dateToTimeFormat(event.dd)} à ${dateToTimeFormat(event.df)}`,
    [event.dd, event.df]
  );

  useEffect(() => {
    const inscriptionTmp = inscriptions.find(e => e.eventid == event.id);
    if (inscriptionTmp) {
      setInscription(inscriptionTmp);
    } else {
      setInscription(null);
    }
  }, [inscriptions, event.id]);

  const handleRegister = useCallback(async () => {
    try {
      const inscriptionResponse = await api.post('/inscription', {
        eventId: event.id,
        personPhysicId: currentUser.id
      });
      addItem('inscriptions', inscriptionResponse);
    } catch (err) {
      console.error('Erreur:', err);
    }
  }, [event.id, currentUser.id, addItem]);

  const handleUnregister = useCallback(async () => {
    try {
      await api.delete(`/inscription/${inscription.id}`);
      deleteItem('inscriptions', inscription.id);
    } catch (err) {
      console.error('Erreur:', err);
    }
  }, [inscription, deleteItem]);

  const handleModalClick = useCallback((e) => e.stopPropagation(), []);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={handleModalClick}>
        <button onClick={onClose} className={styles.closeButton}>
          <Xmark />
        </button>
        <h2 className={styles.title}>{event.label}</h2>
        <div className={styles.content}>
          <p className={styles.date}>{displayDate}</p>
          <p className={styles.description}>{event.description}</p>
          <p className={styles.info}><strong>Type d'événement:</strong> {type.label}</p>
          <p className={styles.info}><strong>Adresse:</strong> {`${address.street}, ${address.postalcode} ${address.city}`}</p>
          <p className={styles.info}><strong>Maximum d'inscriptions:</strong> {event.MaxPerson || "Aucune limite"}</p>
        </div>
        <div className={styles.buttonContainer}>
          {!inscription ? (
            <button className={styles.registerButton} onClick={handleRegister}>S'inscrire</button>
          ) : (
            <button className={styles.unregisterButton} onClick={handleUnregister}>Se désinscrire</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ModalInfoEvent);