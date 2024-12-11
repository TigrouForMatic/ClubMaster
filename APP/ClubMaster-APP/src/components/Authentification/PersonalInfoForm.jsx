import React, { useState } from 'react';
import useStore from '../../store/store';
import api from '../../js/App/Api';
import styles from '../../styles/AuthForm.module.css';
import { OpenInWindow } from 'iconoir-react';
import PrivacyPolicyModal from '../Modale/PrivacyPolicyModal';
import GeneralConditionModal from '../Modale/GeneralConditionModal';

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

  const [consentGivenPolitique, setConsentGivenPolitique] = useState(false);
  const [consentGivenConditions, setConsentGivenConditions] = useState(false);
  const [error, setError] = useState('');
  const [modalIsOpenPolitique, setModalIsOpenPolitique] = useState(false);
  const [modalIsOpenConditions, setModalIsOpenConditions] = useState(false);

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
    if (!consentGivenPolitique || !consentGivenConditions) {
      setError("Veuillez accepter la politique de confidentialité et les conditions générales pour continuer.");
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
        emailaddress: login.login,
        generalConditions: consentGivenConditions,
        privacyPolicy: consentGivenPolitique
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
    }
  };

  const openModalPolitique = () => {
    setModalIsOpenPolitique(true);
  };

  const closeModalPolitique = () => {
    setModalIsOpenPolitique(false);
  };

  const openModalConditions = () => {
    setModalIsOpenConditions(true);
  };

  const closeModalConditions = () => {
    setModalIsOpenConditions(false);
  };

  const handleAcceptPolitique = () => {
    setConsentGivenPolitique(true);
    closeModalPolitique();
  };

  const handleAcceptConditions = () => {
    setConsentGivenConditions(true);
    closeModalConditions();
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
      
      <div className={styles.checkboxLabel}>
        <div className={styles.checkboxContainer}>
          <input
            type="checkbox"
            checked={consentGivenPolitique}
            onChange={(e) => setConsentGivenPolitique(e.target.checked)}
          />
          <span className={styles.checkboxText}>
            J'ai lu et j'accepte la politique de confidentialité
          </span>
          
          <OpenInWindow 
            className={styles.iconDetail} 
            onClick={openModalPolitique} 
            style={{ cursor: 'pointer', width: '16px', height: '16px' }} 
          />
        </div>

        <div className={styles.checkboxContainer}>
          <input
            type="checkbox"
            checked={consentGivenConditions}
            onChange={(e) => setConsentGivenConditions(e.target.checked)}
          />
          <span className={styles.checkboxText}>
            J'ai lu et j'accepte les conditions générales d'utilisation
          </span>
          
          <OpenInWindow 
            className={styles.iconDetail} 
            onClick={openModalConditions} 
            style={{ cursor: 'pointer', width: '16px', height: '16px' }} 
          />
        </div>
      </div>
      <button className={styles.submitButton} type="submit" disabled={!consentGivenPolitique || !consentGivenConditions}>
        Enregistrer et continuer
      </button>

      <PrivacyPolicyModal isOpen={modalIsOpenPolitique} onRequestClose={closeModalPolitique} onAccept={handleAcceptPolitique} />
      <GeneralConditionModal isOpen={modalIsOpenConditions} onRequestClose={closeModalConditions} onAccept={handleAcceptConditions} />
    </form>
  );
}

export default PersonalInfoForm;