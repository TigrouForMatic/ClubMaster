import React, { useState } from 'react';
import { Modal, Button } from '../ui';
import SignaturePad from '../SignaturePad';

const ModalMembershipForm = ({ form, isOpen, onClose, onAccept }) => {

  const [signature, setSignature] = useState<string>('');
  const [hasAcknowledged, setHasAcknowledged] = useState(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{form.title}</h2>
          {form.clubLogo && (
            <img src={form.clubLogo} alt="Logo du club" className="h-16 w-16 object-contain" />
          )}
        </div>
        
        <div className="text-gray-600">Période : {form.period}</div>
        
        <div className="prose">
          <p>{form.description}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded">
          <p className="text-sm">{form.legalText}</p>
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
          <Button variant="secondary" onClick={onClose}>
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
    </Modal>
  );
};

export default ModalMembershipForm;