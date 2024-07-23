import React, { useState } from 'react';
import styles from "../../styles/CartPage.module.css";
import api from '../../js/App/Api';

function AddressSection({ currentUserAddresses, selectedAddressId, onAddressSelect, currentUser, addItem }) {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalcode: '',
    country: ''
  });

  const handleAddAddress = () => {
    setShowAddressForm(!showAddressForm);
  };

  const handleAddressChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const handleSubmitAddress = async(e) => {
    e.preventDefault();

    try {
      const addressResponse = await api.post('/address/', {
        ...newAddress,
        referenceid: currentUser.id,
        private: true,
        validate: true
      });

      addItem('currentUserAddresses', addressResponse);
      onAddressSelect(addressResponse.id);
    } catch (err) {
      console.error('Erreur:', err);
      // Gérer l'erreur ici
    } finally {
      setShowAddressForm(false);
    }
  };

  return (
    <div className={styles.paymentSection}>
      <h3>Adresse de facturation</h3>
      {currentUserAddresses.map((add) => (
        <div 
          key={add.id} 
          className={`${styles.addressOption} ${selectedAddressId === add.id ? styles.selectedAddress : ''}`}
          onClick={() => onAddressSelect(add.id)}
        >
          <p>{add.street}</p>
          <p>{add.postalcode} {add.city}</p>
          <p>{add.state}, {add.country}</p>
        </div>
      ))}
      <button onClick={handleAddAddress} className={styles.addButton}>Ajouter une adresse</button>
      {showAddressForm && (
        <form onSubmit={handleSubmitAddress} className={styles.addressForm}>
          <input type="text" name="street" value={newAddress.street} onChange={handleAddressChange} placeholder="Rue" required />
          <input type="text" name="city" value={newAddress.city} onChange={handleAddressChange} placeholder="Ville" required />
          <input type="text" name="state" value={newAddress.state} onChange={handleAddressChange} placeholder="État/Région" required />
          <input type="text" name="postalcode" value={newAddress.postalcode} onChange={handleAddressChange} placeholder="Code postal" required />
          <input type="text" name="country" value={newAddress.country} onChange={handleAddressChange} placeholder="Pays" required />
          <button type="submit">Ajouter</button>
        </form>
      )}
    </div>
  );
}

export default AddressSection;