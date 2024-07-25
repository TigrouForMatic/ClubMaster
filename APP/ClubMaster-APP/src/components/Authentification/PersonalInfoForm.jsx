import React, { useState } from 'react';
import useStore from '../../store/store';
import api from '../../js/App/Api';
import styles from '../../styles/AuthForm.module.css';
import { OpenInWindow } from 'iconoir-react';
import PrivacyPolicyModal from '../Modale/PrivacyPolicyModal';

function PersonalInfoForm({ handlePersonalInformationSet }) {
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    bornDate: '',
  });

  const [addressInfo, setAddressInfo] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });

  const [consentGiven, setConsentGiven] = useState(false);
  const [error, setError] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const setItems = useStore((state) => state.setItems);
  const login = useStore((state) => state.login);

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!consentGiven) {
      setError("Veuillez accepter la politique de confidentialité pour continuer.");
      return;
    }

    if (!login.id) {
      setError('ID de connexion non trouvé. Veuillez vous reconnecter.');
      return;
    }

    try {
      const personalInfoResponse = await api.post('/personPhysic', {
        name: `${personalInfo.firstName} ${personalInfo.lastName}`,
        naissanceDate: personalInfo.bornDate,
        phoneNumber: personalInfo.phoneNumber,
        loginId: login.id,
        emailaddress: login
      });

      setItems('currentUser', personalInfoResponse);

      const addressResponse = await api.post('/address/', {
        ...addressInfo,
        referenceid: personalInfoResponse.id,
        private: true,
        validate: true
      });

      setItems('currentAddressesPerson', addressResponse)

      handlePersonalInformationSet();
    } catch (err) {
      console.error('Erreur:', err);
      setError('Une erreur est survenue. Veuillez réessayer.');
      setConsentGiven(false);
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.authForm}>
      {error && <p className={styles.error}>{error}</p>}
      
      <h2>Informations personnelles</h2>
      <input
        type="text"
        name="firstName"
        placeholder="Prénom"
        value={personalInfo.firstName}
        onChange={handlePersonalInfoChange}
        required
      />
      <input
        type="text"
        name="lastName"
        placeholder="Nom"
        value={personalInfo.lastName}
        onChange={handlePersonalInfoChange}
        required
      />
      <input
        type="tel"
        name="phoneNumber"
        placeholder="Numéro de téléphone"
        value={personalInfo.phoneNumber}
        onChange={handlePersonalInfoChange}
      />
      <input
        type="date"
        name="bornDate"
        placeholder="Date de naissance"
        value={personalInfo.bornDate}
        onChange={handlePersonalInfoChange}
      />

      <h2>Adresse</h2>
      {Object.entries(addressInfo).map(([key, value]) => (
        <input
          key={key}
          type="text"
          name={key}
          placeholder={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
          value={value}
          onChange={handleAddressChange}
        />
      ))}
      
      <label className={styles.checkboxLabel}>
        <div className={styles.checkboxContainer}>
          <input
            type="checkbox"
            checked={consentGiven}
            onChange={(e) => setConsentGiven(e.target.checked)}
          />
          <span className={styles.checkboxText}>
            J'accepte la politique de confidentialité et le traitement de mes données personnelles
          </span>
          <OpenInWindow 
            className={styles.iconDetail} 
            onClick={openModal} 
            style={{ cursor: 'pointer', width: '16px', height: '16px' }} 
          />
        </div>
      </label>
      <button type="submit" disabled={!consentGiven}>
        Enregistrer et continuer
      </button>
      
      {/* <button type="button" onClick={onAuthenticate} className={styles.skipButton}>
        Passer pour le moment
      </button> */}

      <PrivacyPolicyModal isOpen={modalIsOpen} onRequestClose={closeModal} />
    </form>
  );
}

export default PersonalInfoForm;