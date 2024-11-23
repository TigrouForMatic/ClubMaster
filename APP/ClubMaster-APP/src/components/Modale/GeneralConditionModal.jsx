// GeneralConditionModal.js
import React from 'react';
import Modal from 'react-modal';
import styles from '../../styles/AuthForm.module.css';

function GeneralConditionModal({ isOpen, onRequestClose, onAccept }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Conditions générales d'utilisation"
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Conditions générales d'utilisation</h2>
        
        <div className={styles.modalSection}>
          <p>Les présentes conditions générales d'utilisation (CGU) régissent l'utilisation de l'application ClubMaster. En utilisant notre application, vous acceptez d'être lié par ces conditions.</p>
        </div>

        <div className={styles.modalSection}>
          <h3>1. Collecte et utilisation des données</h3>
          <p>Nous collectons et traitons les informations suivantes :</p>
          <ul>
            <li>Nom et prénom : pour l'identification et la personnalisation de votre compte</li>
            <li>Date de naissance : pour la vérification de l'âge et les fonctionnalités personnalisées</li>
            <li>Adresse : pour le covoiturage et la gestion des événements locaux</li>
            <li>Numéro de téléphone : pour la sécurité du compte et les communications importantes</li>
            <li>Adresse email : pour les communications officielles et la récupération du compte</li>
            <li>Données de connexion : pour la sécurité et l'amélioration de nos services</li>
          </ul>
        </div>

        <div className={styles.modalSection}>
          <h3>2. Base légale du traitement</h3>
          <p>Le traitement de vos données personnelles repose sur :</p>
          <ul>
            <li>Votre consentement explicite</li>
            <li>L'exécution du contrat nous liant</li>
            <li>Nos obligations légales</li>
            <li>Notre intérêt légitime à améliorer nos services</li>
          </ul>
        </div>

        <div className={styles.modalSection}>
          <h3>3. Durée de conservation</h3>
          <p>Vos données sont conservées selon les modalités suivantes :</p>
          <ul>
            <li>Données du compte : pendant la durée d'activité du compte + 3 ans après la dernière utilisation</li>
            <li>Données de transaction : 10 ans (obligation légale)</li>
            <li>Données de navigation : 13 mois maximum</li>
          </ul>
        </div>

        <div className={styles.modalSection}>
          <h3>4. Vos droits</h3>
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul>
            <li>Droit d'accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit à l'effacement (droit à l'oubli)</li>
            <li>Droit à la limitation du traitement</li>
            <li>Droit à la portabilité</li>
            <li>Droit d'opposition</li>
          </ul>
          <p>Pour exercer ces droits, contactez-nous à : privacy@clubmaster.com</p>
        </div>

        <div className={styles.modalSection}>
          <h3>5. Sécurité</h3>
          <p>Nous mettons en œuvre les mesures de sécurité suivantes :</p>
          <ul>
            <li>Chiffrement des données sensibles</li>
            <li>Authentification à deux facteurs</li>
            <li>Surveillance continue des accès</li>
            <li>Sauvegardes régulières</li>
            <li>Mises à jour de sécurité</li>
          </ul>
        </div>

        <div className={styles.modalSection}>
          <h3>6. Cookies</h3>
          <p>Notre application utilise des cookies pour améliorer votre expérience. Vous pouvez les gérer dans vos paramètres.</p>
        </div>

        <div className={styles.modalSection}>
          <h3>7. Modifications des CGU</h3>
          <p>Nous nous réservons le droit de modifier ces CGU à tout moment. Les utilisateurs seront informés des changements importants.</p>
        </div>

        <hr className={styles.modalSeparator} />
        <div className={styles.modalButtonContainer}>
          <button onClick={onRequestClose} className={styles.modalButton}>Fermer</button>
          <button onClick={onAccept} className={styles.modalButton}>Accepter</button>
        </div>
      </div>
    </Modal>
  );
}

export default GeneralConditionModal;