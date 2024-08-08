import React, { useState, useCallback, useEffect, useRef } from 'react';
import useStore from '../store/store';
import api from '../js/App/Api';
import { dateFormat, dateToTimeFormat } from '../js/date';
import styles from "../styles/Conversation.module.css";

const Conversation = React.memo(({ conversation }) => {
  const { currentUser, addMessageToConversation } = useStore();
  const [newMessage, setNewMessage] = useState('');
  const messagesContainerRef = useRef(null);

  const messages = conversation?.messages || [];

  const handleSendMessage = useCallback(async () => {
    try {
      const messageResponse = await api.post('/message', {
        content: newMessage,
        conversationid: conversation.conversationid,
        personPhysicId: currentUser.id,
      });

      const newMessageData = {
        content: messageResponse.content,
        messageid:messageResponse.id,
        personname: currentUser.name,
        personphysicid: messageResponse.personphysicid,
        sentat: messageResponse.dc
      }

      addMessageToConversation(conversation.conversationid, newMessageData);
      setNewMessage('');
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    } catch (err) {
      console.error('Erreur:', err);
    }
  }, [conversation.conversationid, newMessage, currentUser, addMessageToConversation]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={styles.conversation}>
      <div className={styles.messagesContainer} ref={messagesContainerRef}>
        {messages.length > 0 ? (
          messages.map((message, index) => {
            const previousMessage = index > 0 ? messages[index - 1] : null;
            const showDate = !previousMessage || dateFormat(message.sentat) !== dateFormat(previousMessage.sentat);
            const alignSelf = message.personphysicid !== currentUser.id ? 'flex-start' : 'flex-end';

            return (
              <React.Fragment key={message.messageid}>
                {showDate && (
                  <div className={styles.dateLabel}>
                    {dateFormat(message.sentat)}
                  </div>
                )}
                <div
                  className={`${styles.message} ${message.personphysicid !== currentUser.id ? styles.currentUserMessage : ''}`}
                  style={{ width: '75%', alignSelf }}
                >  
                  { message.personphysicid !== currentUser.id && 
                    <p className={styles.messageAuthor} style={{ textAlign: 'left' }}>
                        {message.personname}
                    </p>
                  }
                  <p className={styles.messageContent} style={{ textAlign: message.personphysicid !== currentUser.id ? 'left' : 'right' }}>
                    {message.content}
                  </p>
                  <p className={styles.messageDate} style={{ textAlign: 'right' }}>
                    {dateToTimeFormat(message.sentat)}
                  </p>
                </div>
              </React.Fragment>
            );
          })
        ) : (
          <p className={styles.noMessages}>Aucun message pour le moment.</p>
        )}
      </div>
      <div className={styles.newMessageContainer}>
        <textarea
          className={`${styles.newMessageInput} ${styles.newMessageInputSmall}`}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Écrire un nouveau message..."
        />
        <button className={`${styles.sendButton} ${styles.sendButtonSmall}`} onClick={handleSendMessage}>
          Envoyer
        </button>
      </div>
    </div>
  );
});

export default Conversation;