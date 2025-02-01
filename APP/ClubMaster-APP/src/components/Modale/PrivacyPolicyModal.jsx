// PrivacyPolicyModal.js
import React from 'react';
import Modal from 'react-modal';

function PrivacyPolicyModal({ isOpen, onRequestClose, onAccept }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Politique de confidentialité"
      className="relative bg-white rounded-lg shadow-lg w-full max-w-3xl mx-auto mt-10 max-h-[90vh] overflow-y-auto p-6"
      overlayClassName="fixed inset-0 bg-black/50 z-50 flex items-start justify-center"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Politique de confidentialité et traitement des données personnelles
          </h2>
          <button 
            onClick={onRequestClose}
            className="text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        
        <div className="prose prose-zinc max-w-none">
          <p className="text-zinc-600">
            Conformément au Règlement Général sur la Protection des Données (RGPD), 
            nous vous informons de l'utilisation de vos données personnelles :
          </p>

          <div className="space-y-4">
            <section>
              <h3 className="text-lg font-semibold">1. Collecte et utilisation des données</h3>
              <p className="text-zinc-600">Nous collectons les informations suivantes :</p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-600">
                <li>Nom et prénom : pour vous identifier dans notre système</li>
                <li>Date de naissance : pour personnaliser votre expérience (par exemple, pour vous souhaiter un joyeux anniversaire)</li>
                <li>Adresse : pour faciliter les fonctionnalités de covoiturage intégrées à notre application</li>
                <li>Numéro de téléphone : pour vous contacter en cas de besoin et faciliter les communications liées au covoiturage</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold">2. Base légale du traitement</h3>
              <p className="text-zinc-600">
                Le traitement de vos données personnelles est basé sur votre consentement explicite.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">3. Durée de conservation</h3>
              <p className="text-zinc-600">
                Vos données seront conservées tant que votre compte est actif. 
                Vous pouvez demander leur suppression à tout moment.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">4. Vos droits</h3>
              <p className="text-zinc-600">
                Vous avez le droit d'accéder, de rectifier, de supprimer vos données 
                ou de retirer votre consentement à tout moment.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">5. Sécurité</h3>
              <p className="text-zinc-600">
                Nous mettons en place des mesures de sécurité appropriées pour protéger 
                vos données contre tout accès non autorisé ou toute perte accidentelle.
              </p>
            </section>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            onClick={onRequestClose}
            className="px-4 py-2 text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-md transition-colors"
          >
            Fermer
          </button>
          <button
            onClick={onAccept}
            className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-md transition-colors"
          >
            Accepter
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default PrivacyPolicyModal;