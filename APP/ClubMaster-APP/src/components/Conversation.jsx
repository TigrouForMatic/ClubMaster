import React, { useState, useCallback, useEffect, useRef } from 'react';
import useStore from '../store/store';
import api from '../js/App/Api';
import { dateFormat, dateToTimeFormat } from '../js/date';
import UserImage from './UserImage';
import { useWebSocket } from '../hooks/useWebSocket';

const Conversation = React.memo(({ conversation }) => {
  const { currentUser, addMessageToConversation } = useStore();
  const [newMessage, setNewMessage] = useState('');
  const messagesContainerRef = useRef(null);
  const { sendMessage } = useWebSocket(conversation.conversationid);

  const messages = conversation?.messages || [];

  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim()) return;
    
    try {
      const messageResponse = await api.post('/message', {
        content: newMessage.trim(),
        conversationid: conversation.conversationid,
        loginId: currentUser.id,
      });

      if (messageResponse && messageResponse.id) {
        const newMessageData = {
          content: messageResponse.content,
          messageid: messageResponse.id,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          loginid: messageResponse.loginid,
          sentat: messageResponse.dc
        };

        // Envoyer le message via WebSocket
        sendMessage(newMessageData);
        setNewMessage('');
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      }
    } catch (err) {
      console.error('Erreur lors de l\'envoi du message:', err);
    }
  }, [conversation.conversationid, newMessage, currentUser, sendMessage]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200">
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.length > 0 ? (
          messages.map((message, index) => {
            const previousMessage = index > 0 ? messages[index - 1] : null;
            const showDate = !previousMessage || dateFormat(message.sentat) !== dateFormat(previousMessage.sentat);
            const isCurrentUserMessage = message.loginid === currentUser.id;

            return (
              <React.Fragment key={message.messageid}>
                {showDate && (
                  <div className="flex justify-center">
                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {dateFormat(message.sentat)}
                    </span>
                  </div>
                )}
                <div className={`flex ${isCurrentUserMessage ? 'justify-end' : 'justify-start'} gap-2`}>
                  {!isCurrentUserMessage && (
                    <div className="flex-shrink-0">
                      <UserImage name={message.firstName + ' ' + message.lastName} size={30} />
                    </div>
                  )}
                  <div className={`max-w-[70%] ${isCurrentUserMessage ? 'order-1' : 'order-2'}`}>
                    {!isCurrentUserMessage && (
                      <p className="text-sm text-gray-600 mb-1">
                        {message.firstName + ' ' + message.lastName}
                      </p>
                    )}
                    <div className={`rounded-lg p-3 ${
                      isCurrentUserMessage 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm break-words">
                        {message.content}
                      </p>
                      <div className={`flex justify-${isCurrentUserMessage ? 'end' : 'start'}`}>
                        <p className="text-[10px] mt-0.5 opacity-60">
                          {dateToTimeFormat(message.sentat)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })
        ) : (
          <p className="text-center text-gray-500 italic">
            Aucun message pour le moment.
          </p>
        )}
      </div>
      <div className="border-t p-4 space-x-2 flex">
        <textarea
          className="flex-1 min-h-[40px] max-h-[120px] resize-none rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Écrire un nouveau message..."
          rows={1}
        />
        <button
          onClick={handleSendMessage}
          className="inline-flex items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
});

export default Conversation;