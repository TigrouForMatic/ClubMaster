import React from 'react';
import Modal from 'react-modal';

function GeneralConditionModal({ isOpen, onRequestClose, onAccept }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Conditions générales d'utilisation"
      className="relative bg-white rounded-lg shadow-lg w-full max-w-3xl mx-auto mt-10 max-h-[90vh] overflow-y-auto p-6 scrollbar-hide"
      overlayClassName="fixed inset-0 bg-black/50 z-50 flex items-start justify-center"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Conditions générales d'utilisation
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
            Les présentes conditions générales d'utilisation (CGU) régissent l'utilisation de l'application ClubMaster. 
            En utilisant notre application, vous acceptez d'être lié par ces conditions.
          </p>

          <div className="space-y-4">
            <section>
              <h3 className="text-lg font-semibold">1. Collecte et utilisation des données</h3>
              <p className="text-zinc-600">Nous collectons et traitons les informations suivantes :</p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-600">
                <li>Nom et prénom : pour l'identification et la personnalisation de votre compte</li>
                <li>Date de naissance : pour la vérification de l'âge et les fonctionnalités personnalisées</li>
                <li>Adresse : pour le covoiturage et la gestion des événements locaux</li>
                <li>Numéro de téléphone : pour la sécurité du compte et les communications importantes</li>
                <li>Adresse email : pour les communications officielles et la récupération du compte</li>
                <li>Données de connexion : pour la sécurité et l'amélioration de nos services</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold">2. Base légale du traitement</h3>
              <p className="text-zinc-600">Le traitement de vos données personnelles repose sur :</p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-600">
                <li>Votre consentement explicite</li>
                <li>L'exécution du contrat nous liant</li>
                <li>Nos obligations légales</li>
                <li>Notre intérêt légitime à améliorer nos services</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold">3. Durée de conservation</h3>
              <p className="text-zinc-600">Vos données sont conservées selon les modalités suivantes :</p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-600">
                <li>Données du compte : pendant la durée d'activité du compte + 3 ans après la dernière utilisation</li>
                <li>Données de transaction : 10 ans (obligation légale)</li>
                <li>Données de navigation : 13 mois maximum</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold">4. Vos droits</h3>
              <p className="text-zinc-600">Conformément au RGPD, vous disposez des droits suivants :</p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-600">
                <li>Droit d'accès à vos données</li>
                <li>Droit de rectification</li>
                <li>Droit à l'effacement (droit à l'oubli)</li>
                <li>Droit à la limitation du traitement</li>
                <li>Droit à la portabilité</li>
                <li>Droit d'opposition</li>
              </ul>
              <p className="text-zinc-600 mt-2">Pour exercer ces droits, contactez-nous à : privacy@clubmaster.com</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">5. Sécurité</h3>
              <p className="text-zinc-600">Nous mettons en œuvre les mesures de sécurité suivantes :</p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-600">
                <li>Chiffrement des données sensibles</li>
                <li>Authentification à deux facteurs</li>
                <li>Surveillance continue des accès</li>
                <li>Sauvegardes régulières</li>
                <li>Mises à jour de sécurité</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold">6. Cookies</h3>
              <p className="text-zinc-600">
                Notre application utilise des cookies pour améliorer votre expérience. 
                Vous pouvez les gérer dans vos paramètres.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">7. Modifications des CGU</h3>
              <p className="text-zinc-600">
                Nous nous réservons le droit de modifier ces CGU à tout moment. 
                Les utilisateurs seront informés des changements importants.
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

export default GeneralConditionModal;