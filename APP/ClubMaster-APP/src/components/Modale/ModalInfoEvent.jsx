import React, { useCallback, useMemo, useEffect, useState } from 'react';
import useStore from '../../store/store';
import api from '../../js/App/Api';
import { dateToTimeFormat, dateFormat } from '../../js/date';
import styles from "../../styles/Modale.module.css";
import { Xmark } from 'iconoir-react';
import CustomConfirm from '../CustomConfirm';
import Conversation from '../Conversation';

const ModalInfoEvent = ({ isOpen, onClose, event }) => {
  if (!isOpen || !event) return null;

  const [inscription, setInscription] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  const { addItem, deleteItem, addresses, typesEvent, inscriptions, currentUser, conversations } = useStore();

  const type = useMemo(() => typesEvent.find(e => e.id === event.eventtypeid) || {}, [typesEvent, event.eventtypeid]);
  const address = useMemo(() => addresses.find(e => e.id === event.addressid) || {}, [addresses, event.addressid]);

  const displayDate = useMemo(() => 
    `Le ${dateFormat(event.dd)} de ${dateToTimeFormat(event.dd)} à ${dateToTimeFormat(event.df)}`,
    [event.dd, event.df]
  );

  const findExistingConversation = useCallback(() => {
    return conversations.flat().find(conv => conv.eventid === event.id);
  }, [conversations, event.id]);

  useEffect(() => {
    const existingConversation = findExistingConversation();
    if (existingConversation) {
      setConversation(existingConversation);
    } else {
      const fetchConversation = async () => {
        try {
          const conversationResponse = await api.get(`/conversation/event/${event.id}`);
          addItem('conversations', conversationResponse);
          setConversation(conversationResponse);
        } catch (err) {
          console.error('Erreur:', err);
        }
      };
      fetchConversation();
    }
  }, [findExistingConversation, addItem, event.id]);

  useEffect(() => {
    const inscriptionTmp = inscriptions.find(e => e.eventid === event.id);
    setInscription(inscriptionTmp || null);
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

  const handleUnregister = useCallback(() => {
    setIsConfirmOpen(true);
  }, []);

  const confirmUnregister = useCallback(async () => {
    try {
      await api.delete(`/inscription/${inscription.id}`);
      deleteItem('inscriptions', inscription.id);
      setIsConfirmOpen(false);
      setInscription(null);
    } catch (err) {
      console.error('Erreur:', err);
    }
  }, [inscription, deleteItem]);

  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget && !isConfirmOpen) {
      onClose();
    }
  }, [onClose, isConfirmOpen]);

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
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
        
        {conversation && (
          <div className={styles.conversation}>
            <h3 className={styles.conversationTitle}>Discussion</h3>
            <Conversation conversation={conversation} />
          </div>
        )}
        
        {isConfirmOpen && (
          <CustomConfirm 
            isOpen={isConfirmOpen}
            message={`Êtes-vous sûr de vouloir supprimer votre inscription à ${event.label} ?`}
            onConfirm={confirmUnregister}
            onCancel={() => setIsConfirmOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(ModalInfoEvent);