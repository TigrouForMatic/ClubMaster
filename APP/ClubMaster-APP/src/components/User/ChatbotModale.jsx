import React, { useCallback, useMemo, useEffect, useState } from 'react';
import useStore from '../../store/store';
import api from '../../js/App/Api';
import { Xmark} from 'iconoir-react';

const ChatbotModale = ({ isOpen, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [response, setResponse] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  }, [onClose]);

  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  const handleGenerateResponse = useCallback(async () => {
    if (!prompt) return;
    setIsLoading(true);
    try {
      const response = await api.get('/generateResponse', {
        params: { prompt: prompt },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setResponse(response.data.response);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  if (!isOpen) return null;

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

          <div>
            <h2 className="text-lg font-semibold">Chatbot</h2>
            <div>
              <input type="text" value={prompt} placeholder="Entrez votre message" onChange={(e) => setPrompt(e.target.value)} />
              <button onClick={handleGenerateResponse} className="bg-black text-white px-4 py-2 rounded" disabled={isLoading}>
                {isLoading ? "Chargement..." : "Générer"}
              </button>
            </div>
            <h2 className="text-lg font-semibold mt-8">Réponse</h2>
              <div className="mt-4">
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2">Chargement...</span>
                </div>
              ) : (
                <p>{response || "En attente de génération..."}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ChatbotModale);