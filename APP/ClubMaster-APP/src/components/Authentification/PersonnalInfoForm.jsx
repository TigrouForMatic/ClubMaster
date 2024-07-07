import React, { useState } from 'react';
import styles from '../../styles/AuthForm.module.css';

function PersonalInfoForm({ onAuthenticate }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });

  const [consentGiven, setConsentGiven] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!consentGiven) {
      setError("Veuillez accepter la politique de confidentialité pour continuer.");
      return;
    }

    try {
      // Enregistrement de l'adresse
      const addressResponse = await fetch('http://localhost:3200/api/address/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          private: true,
          validate: true
        }),
      });

      if (!addressResponse.ok) {
        throw new Error('Erreur lors de l\'enregistrement de l\'adresse');
      }

      const addressData = await addressResponse.json();
      const addressId = addressData.id;

       // Récupération et parsing sécurisé de l'ID de connexion
      let loginId;
      const storedLogin = localStorage.getItem('login');
      if (storedLogin) {
        try {
          const loginData = JSON.parse(storedLogin);
          loginId = loginData.id;
        } catch (parseError) {
          console.error('Erreur lors du parsing des données de connexion:', parseError);
          setError('Erreur lors de la récupération des données de connexion. Veuillez vous reconnecter.');
          return;
        }
      }

      if (!loginId) {
        setError('ID de connexion non trouvé. Veuillez vous reconnecter.');
        return;
      }

      // Enregistrement des informations personnelles
      // const personalInfoResponse = await fetch('http://localhost:3200/api/user/personal-info', {
      const personalInfoResponse = await fetch('http://localhost:3200/api/personPhysic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: formData.firstName + ' ' + formData.lastName,
          phoneNumber: formData.phoneNumber,
          loginId: JSON.parse(localStorage.getItem('login')).id,
          addressId: addressId
        }),
      });

      if (!personalInfoResponse.ok) {
        throw new Error('Erreur lors de l\'enregistrement des informations personnelles');
      }

      console.log('Informations personnelles enregistrées avec succès');
      onAuthenticate();
    } catch (err) {
      console.error('Erreur:', err);
      setError('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  const continueWithoutSetInformation = () => {
    console.log('Continuer sans donner ses informations');
    onAuthenticate();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.authForm}>
      {error && <p className={styles.error}>{error}</p>}
      <h2>Informations personnelles</h2>
      <input
        type="text"
        name="firstName"
        placeholder="Prénom"
        value={formData.firstName}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="lastName"
        placeholder="Nom"
        value={formData.lastName}
        onChange={handleChange}
        required
      />
      <input
        type="tel"
        name="phoneNumber"
        placeholder="Numéro de téléphone"
        value={formData.phoneNumber}
        onChange={handleChange}
      />
      <input
        type="text"
        name="street"
        placeholder="Rue"
        value={formData.street}
        onChange={handleChange}
      />
      <input
        type="text"
        name="city"
        placeholder="Ville"
        value={formData.city}
        onChange={handleChange}
      />
      <input
        type="text"
        name="state"
        placeholder="État/Région"
        value={formData.state}
        onChange={handleChange}
      />
      <input
        type="text"
        name="postalCode"
        placeholder="Code postal"
        value={formData.postalCode}
        onChange={handleChange}
      />
      <input
        type="text"
        name="country"
        placeholder="Pays"
        value={formData.country}
        onChange={handleChange}
      />
      
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={consentGiven}
          onChange={(e) => setConsentGiven(e.target.checked)}
        />
        J'accepte la politique de confidentialité et le traitement de mes données personnelles
      </label>
      <button type="submit" disabled={!consentGiven}>
        Enregistrer et continuer
      </button>
      <button onClick={continueWithoutSetInformation} className={styles.skipButton}>
        Passer pour le moment
      </button>
    </form>
  );
}

export default PersonalInfoForm;