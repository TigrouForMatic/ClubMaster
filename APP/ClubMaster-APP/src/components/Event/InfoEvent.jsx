import React, { useCallback, useMemo, useEffect, useState } from 'react';
import useStore from '../../store/store';
import api from '../../js/App/Api';
import { dateToTimeFormat, dateFormat } from '../../js/date';
import styles from "../../styles/InfoEvent.module.css";
import { Xmark, EditPencil, Trash } from 'iconoir-react';
import Conversation from '../Conversation';
import CustomConfirm from '../CustomConfirm';
import EditEvent from './EditEvent';

const InfoEvent = ({ isOpen, onClose, eventId }) => {
  if (!isOpen || !eventId) return null;

  const { addItem, deleteItem, addresses, typesEvent, inscriptions, currentUser, conversations, currentUserRoles } = useStore();
  const getItem = useStore(state => state.getItem);

  const [inscription, setInscription] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const eventData = getItem('events', eventId)(useStore.getState());
    setEvent(eventData);
  }, [eventId, getItem]);


  const type = useMemo(() => 
    event ? typesEvent.find(e => e.id === event.eventtypeid) || {} : {},
    [typesEvent, event?.eventtypeid]
  );
  
  const address = useMemo(() => 
    event ? addresses.find(e => e.id === event.addressid) || {} : {},
    [addresses, event?.addressid]
  );

  const displayDate = useMemo(() => {
    if (!event) return '';
    return event.dd === event.df ?
      `Le ${dateFormat(event.dd)} à partir de ${dateToTimeFormat(event.dd)}` :
      `Du ${dateFormat(event.dd)} de ${dateToTimeFormat(event.dd)} à ${dateToTimeFormat(event.df)}`;
  }, [event?.dd, event?.df]);

  const findExistingConversation = useCallback(() => {
    if (!event) return null;
    return conversations.flat().find(conv => conv.eventid === event.id);
  }, [conversations, event]);

  useEffect(() => {
    if (!event) return;
    
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
  }, [findExistingConversation, addItem, event]);

  useEffect(() => {
    if (!event) return;
    const inscriptionTmp = inscriptions.find(e => e.eventid === event.id);
    setInscription(inscriptionTmp || null);
  }, [inscriptions, event]);

  const handleRegister = useCallback(async () => {
    if (!event) return;
    try {
      const inscriptionResponse = await api.post('/inscription', {
        eventId: event.id,
        personPhysicId: currentUser.id
      });
      addItem('inscriptions', inscriptionResponse);
    } catch (err) {
      console.error('Erreur:', err);
    }
  }, [event, currentUser.id, addItem]);

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

  const handleDelete = useCallback(() => {
    if (!event) return;
    setIsDeleteOpen(true);
  }, [event]);

  const confirmDelete = useCallback(async () => {
    if (!event) return;
    try {
      await api.delete(`/event/${event.id}`);
      deleteItem('events', event.id);
      onClose();
    } catch (err) {
      console.error('Erreur:', err);
    }
  }, [event, deleteItem, onClose]);

  const handleEdit = useCallback(() => {
    setIsEdit(true);
  }, []);

  const handleEditClose = useCallback(() => {
    const eventTmp = getItem('events', eventId)(useStore.getState());
    setEvent(eventTmp);
    setIsEdit(false);
  }, []);

  return (
    <div className={styles.eventOverlay} onClick={handleOverlayClick}>
      <div className={styles.overlay} onClick={(e) => e.stopPropagation()}>
      <button onClick={onClose} className={styles.closeButton}>
          <Xmark />
        </button>
        {!isEdit && event && (
          <>
            <h2 className={styles.title}>{event.label}</h2>
            {currentUserRoles.some(role => role.level >= 3) && (
              <div className={styles.buttonActionsContainer}>
                <button className={styles.editButton} onClick={handleEdit}>
                  <EditPencil />
                </button>
                <button className={styles.deleteButton} onClick={handleDelete}>
                  <Trash />
                </button>
              </div>
            )}
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
          </>
        )}
        {isEdit && event && (
          <>
            <h2 className={styles.title}>Modification de l'événement</h2>
            <EditEvent event={event} onClose={handleEditClose} />
          </>
        )}
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

        {isDeleteOpen && (
          <CustomConfirm 
            isOpen={isDeleteOpen}
            message={`Êtes-vous sûr de vouloir supprimer l'événement ${event.label} du ${dateFormat(event.dd)} ?`}
            onConfirm={confirmDelete}
            onCancel={() => setIsDeleteOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(InfoEvent);