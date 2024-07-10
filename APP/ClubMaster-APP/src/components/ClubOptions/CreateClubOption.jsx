import React, { useState } from 'react';
import styles from '../../styles/CreateClubOptions.module.css';

const CreateClubOption = () => {
  const [clubData, setClubData] = useState({
    label: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setClubData(prevData => ({
        ...prevData,
        address: {
          ...prevData.address,
          [addressField]: value
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
    console.log('Club data to submit:', clubData);
  };

  return (
    <div className={styles.createClubContainer}>
      <h2>Créer un nouveau club</h2>
      <form onSubmit={handleSubmit} className={styles.createClubForm}>
        <div className={styles.formGroup}>
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
        
        <div className={styles.formGroup}>
          <label htmlFor="street">Rue:</label>
          <input
            type="text"
            id="street"
            name="address.street"
            value={clubData.address.street}
            onChange={handleChange}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="city">Ville:</label>
          <input
            type="text"
            id="city"
            name="address.city"
            value={clubData.address.city}
            onChange={handleChange}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="state">État/Province:</label>
          <input
            type="text"
            id="state"
            name="address.state"
            value={clubData.address.state}
            onChange={handleChange}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="postalCode">Code postal:</label>
          <input
            type="text"
            id="postalCode"
            name="address.postalCode"
            value={clubData.address.postalCode}
            onChange={handleChange}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="country">Pays:</label>
          <input
            type="text"
            id="country"
            name="address.country"
            value={clubData.address.country}
            onChange={handleChange}
          />
        </div>
        
        <button type="submit">Créer le club</button>
      </form>
    </div>
  );
};

export default CreateClubOption;