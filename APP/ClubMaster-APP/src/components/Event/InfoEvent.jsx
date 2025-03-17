import React, { useCallback, useMemo, useEffect, useState } from 'react';
import useStore from '../../store/store';
import api from '../../js/App/Api';
import { dateToTimeFormat, dateFormat } from '../../js/date';
import { Xmark, EditPencil, Trash } from 'iconoir-react';
import Conversation from '../Conversation';
import CustomConfirm from '../CustomConfirm';
import EditEvent from './EditEvent';

const InfoEvent = ({ isOpen, onClose, eventId }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [event, setEvent] = useState(null);
  const [inscription, setInscription] = useState(null);
  const [conversation, setConversation] = useState(null);
  
  const { addItem, deleteItem, addresses, typesEvent, inscriptions, currentUser, conversations, currentUserRoles } = useStore();
  const getItem = useStore(state => state.getItem);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  }, [onClose]);

  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget && !isConfirmOpen) {
      handleClose();
    }
  }, [handleClose, isConfirmOpen]);

  if (!isOpen || !eventId) return null;

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
    if (!isOpen || !eventId) return;
    const eventData = getItem('events', eventId)(useStore.getState());
    setEvent(eventData);
  }, [eventId, getItem, isOpen]);

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
        eventid: event.id,
        loginid: currentUser.id
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
    <div className="fixed inset-0 bg-black/30 z-50 flex justify-end" onClick={handleOverlayClick}>
      <div 
        className={`bg-white w-full max-w-3xl h-full overflow-y-auto ${
          isClosing ? 'slide-out' : 'slide-in'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-6">
          <button 
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            <Xmark className="h-4 w-4" />
            <span className="sr-only">Fermer</span>
          </button>

          {!isEdit && event && (
            <>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight">{event.label}</h2>
                {currentUserRoles.some(role => role.level >= 3) && (
                  <div className="absolute right-14 top-4 flex items-center gap-2">
                    <button 
                      onClick={handleEdit}
                      className="rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                    >
                      <EditPencil className="h-4 w-4 text-blue-500" />
                    </button>
                    <button 
                      onClick={handleDelete}
                      className="rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-4">
                <p className="text-sm font-medium text-blue-600">{displayDate}</p>
                <p className="text-sm text-slate-500">{event.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Type d'événement:</span>
                    <span>{type.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Adresse:</span>
                    <span>{`${address.street}, ${address.postalcode} ${address.city}`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Maximum d'inscriptions:</span>
                    <span>{event.MaxPerson || "Aucune limite"}</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  {!inscription ? (
                    <button 
                      onClick={handleRegister}
                      className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      S'inscrire
                    </button>
                  ) : (
                    <button 
                      onClick={handleUnregister}
                      className="inline-flex items-center justify-center rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      Se désinscrire
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {isEdit && event && (
            <>
              <h2 className="text-2xl font-semibold tracking-tight">Modification de l'événement</h2>
              <EditEvent event={event} onClose={handleEditClose} />
            </>
          )}

          {conversation && (
            <div className="mt-8 pt-6 border-t border-slate-200">
              <h3 className="text-lg font-semibold mb-4">Discussion</h3>
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
    </div>
  );
};

export default React.memo(InfoEvent);