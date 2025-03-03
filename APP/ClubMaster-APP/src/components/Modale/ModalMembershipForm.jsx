import React, { useState, useCallback } from 'react';
import { Button } from '../ui';
import SignaturePad from '../SignaturePad';
import MDEditor from '@uiw/react-md-editor';
import { Xmark } from 'iconoir-react';

const ModalMembershipForm = ({ form, isOpen, onClose, onAccept }) => {
  const [signature, setSignature] = useState('');
  const [hasAcknowledged, setHasAcknowledged] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

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

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{form.title}</h2>
              {form.clubLogo && (
                <img src={form.clubLogo} alt="Logo du club" className="h-16 w-16 object-contain" />
              )}
            </div>
            
            <div className="text-gray-600">Période : {form.period}</div>
            
            <div className="prose">
              <MDEditor.Markdown source={form.description} />
            </div>
            
            <div className="bg-gray-50 p-4 rounded">
              <MDEditor.Markdown 
                source={form.legalText} 
                className="text-sm"
              />
            </div>
            
            {form.requiresAcknowledgment && (
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={hasAcknowledged}
                  onChange={(e) => setHasAcknowledged(e.target.checked)}
                />
                <span>J'ai lu et j'accepte les conditions d'adhésion</span>
              </label>
            )}
            
            {form.requiresSignature && (
              <div>
                <p className="mb-2">Veuillez signer ci-dessous :</p>
                <SignaturePad
                  onChange={setSignature}
                  className="border rounded"
                />
              </div>
            )}
            
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={handleClose}>
                Annuler
              </Button>
              <Button
                disabled={
                  (form.requiresAcknowledgment && !hasAcknowledged) ||
                  (form.requiresSignature && !signature)
                }
                onClick={() => onAccept(signature)}
              >
                Confirmer l'adhésion
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalMembershipForm;