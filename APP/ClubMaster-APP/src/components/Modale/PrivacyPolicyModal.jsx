// PrivacyPolicyModal.js
import React from 'react';
import Modal from 'react-modal';
import styles from '../../styles/AuthForm.module.css';

function PrivacyPolicyModal({ isOpen, onRequestClose }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Politique de confidentialité"
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Politique de confidentialité et traitement des données personnelles</h2>
        <div className={styles.modalSection}>
          <p>Conformément au Règlement Général sur la Protection des Données (RGPD), nous vous informons de l'utilisation de vos données personnelles :</p>
        </div>
        <div className={styles.modalSection}>
          <h3>1. Collecte et utilisation des données</h3>
          <p>Nous collectons les informations suivantes :</p>
          <ul>
            <li>Nom et prénom : pour vous identifier dans notre système</li>
            <li>Date de naissance : pour personnaliser votre expérience (par exemple, pour vous souhaiter un joyeux anniversaire)</li>
            <li>Adresse : pour faciliter les fonctionnalités de covoiturage intégrées à notre application</li>
            <li>Numéro de téléphone : pour vous contacter en cas de besoin et faciliter les communications liées au covoiturage</li>
          </ul>
        </div>
        <div className={styles.modalSection}>
          <h3>2. Base légale du traitement</h3>
          <p>Le traitement de vos données personnelles est basé sur votre consentement explicite.</p>
        </div>
        <div className={styles.modalSection}>
          <h3>3. Durée de conservation</h3>
          <p>Vos données seront conservées tant que votre compte est actif. Vous pouvez demander leur suppression à tout moment.</p>
        </div>
        <div className={styles.modalSection}>
          <h3>4. Vos droits</h3>
          <p>Vous avez le droit d'accéder, de rectifier, de supprimer vos données ou de retirer votre consentement à tout moment.</p>
        </div>
        <div className={styles.modalSection}>
          <h3>5. Sécurité</h3>
          <p>Nous mettons en place des mesures de sécurité appropriées pour protéger vos données contre tout accès non autorisé ou toute perte accidentelle.</p>
        </div>
        <div className={styles.modalButtonContainer}>
          <button onClick={onRequestClose} className={styles.modalButton}>Fermer</button>
        </div>
      </div>
    </Modal>
  );
}

export default PrivacyPolicyModal;