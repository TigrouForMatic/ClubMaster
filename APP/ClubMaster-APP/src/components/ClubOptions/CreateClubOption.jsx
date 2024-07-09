import React, { useState } from 'react';
// import styles from '../../styles/CreateClubOptions.module.css';

const CreateClubOption = () => {
  const [clubData, setClubData] = useState({
    label: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      private: false,
      validate: false
    },
    personMoralId: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setClubData(prevData => ({
        ...prevData,
        address: {
          ...prevData.address,
          [addressField]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setClubData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici, vous pouvez ajouter la logique pour envoyer les données au serveur
    console.log('Club data to submit:', clubData);
  };

  return (
    <div className={styles.createClubContainer}>
      <h2>Créer un nouveau club</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="label">Nom du club:</label>
          <input
            type="text"
            id="label"
            name="label"
            value={clubData.label}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="street">Rue:</label>
          <input
            type="text"
            id="street"
            name="address.street"
            value={clubData.address.street}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <label htmlFor="city">Ville:</label>
          <input
            type="text"
            id="city"
            name="address.city"
            value={clubData.address.city}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <label htmlFor="state">État/Province:</label>
          <input
            type="text"
            id="state"
            name="address.state"
            value={clubData.address.state}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <label htmlFor="postalCode">Code postal:</label>
          <input
            type="text"
            id="postalCode"
            name="address.postalCode"
            value={clubData.address.postalCode}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <label htmlFor="country">Pays:</label>
          <input
            type="text"
            id="country"
            name="address.country"
            value={clubData.address.country}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <label>
            <input
              type="checkbox"
              name="address.private"
              checked={clubData.address.private}
              onChange={handleChange}
            />
            Adresse privée
          </label>
        </div>
        
        <div>
          <label>
            <input
              type="checkbox"
              name="address.validate"
              checked={clubData.address.validate}
              onChange={handleChange}
            />
            Valider l'adresse
          </label>
        </div>
        
        <div>
          <label htmlFor="personMoralId">ID de la personne morale:</label>
          <input
            type="text"
            id="personMoralId"
            name="personMoralId"
            value={clubData.personMoralId}
            onChange={handleChange}
          />
        </div>
        
        <button type="submit">Créer le club</button>
      </form>
    </div>
  );
};

export default CreateClubOption;