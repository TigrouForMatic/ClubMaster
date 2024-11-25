import React, { useState } from 'react';
import styles from "../../styles/AdresseForm.module.css";
import api from '../../js/App/Api';
import useStore from '../../store/store';
import { EditPencil, Trash } from 'iconoir-react';

function AddressForm() {
    const addItem = useStore((state) => state.addItem);
    const updateItem = useStore((state) => state.updateItem);
    const deleteItem = useStore((state) => state.deleteItem);

    const { currentUser, currentUserAddresses } = useStore();
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editAddress, setEditAddress] = useState(null);
    const [newAddress, setNewAddress] = useState({
        street: '',
        city: '',
        state: '',
        postalcode: '',
        country: ''
    });

  const handleAddAddress = () => {
    if(editAddress !== null) {
      setEditAddress(null);
    }
    setShowAddressForm(!showAddressForm);
  };

  const handleAddressChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const handleEditAddressChange = (e) => {
    setEditAddress({ ...editAddress, [e.target.name]: e.target.value });
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
    } catch (err) {
      console.error('Erreur:', err);
      // Gérer l'erreur ici
    } finally {
      setShowAddressForm(false);
    }
  };

  const handleSubmitEditAddress = async(e) => {
    e.preventDefault();

    try {
        const addressResponse = await api.put(`/address/${editAddress.id}`, editAddress);
        updateItem('currentUserAddresses', addressResponse.id, addressResponse);
      } catch (err) {
        console.error('Erreur:', err);
        // Gérer l'erreur ici
      } finally {
        setEditAddress(null);
      }
  };

  const handleDeleteAddress = async (id) => {
    await api.delete(`/address/${id}`);
    deleteItem('currentUserAddresses', id);
  };

  const handleEditAddress = async (address) => {
    setEditAddress(address);
  };

  return (
    <div>
      {currentUserAddresses.map((add) => (
        <>  
          {editAddress === null || editAddress.id !== add.id ? (
            <div key={add.id} className={styles.addressOption} >
                <p>{add.street}</p>
                <p>{add.postalcode} {add.city}</p>
                <p>{add.state}, {add.country}</p>
                <button className={styles.editButton} onClick={() => handleEditAddress(add)}><EditPencil /></button>
                <button className={styles.deleteButton} onClick={() => handleDeleteAddress(add.id)}><Trash /></button>
            </div>
          ) : (
            <div className={styles.addressOption}>
              <h3>Modifier l'adresse</h3>
              <div className={styles.addressForm}>
                <input type="text" name="street" value={editAddress.street} onChange={handleEditAddressChange} placeholder="Rue" required />
                <input type="text" name="city" value={editAddress.city} onChange={handleEditAddressChange} placeholder="Ville" required />
                <input type="text" name="state" value={editAddress.state} onChange={handleEditAddressChange} placeholder="État/Région" required />
                <input type="text" name="postalcode" value={editAddress.postalcode} onChange={handleEditAddressChange} placeholder="Code postal" required />
                <input type="text" name="country" value={editAddress.country} onChange={handleEditAddressChange} placeholder="Pays" required />
                <div className={styles.buttonContainer}>
                  <button className={styles.cancelButton} onClick={() => setEditAddress(null)}>Annuler</button>
                  <button onClick={handleSubmitEditAddress}>Modifier</button>
                </div>
              </div>
            </div>
          )}
        </>
      ))}
      {!showAddressForm && (
          <button onClick={handleAddAddress} className={styles.addButton}>Ajouter une adresse</button>
      )}
      {showAddressForm && (
        <>
          <h3>Ajouter une adresse</h3>
          <div className={styles.addressForm}>
            <input type="text" name="street" value={newAddress.street} onChange={handleAddressChange} placeholder="Rue" required />
            <input type="text" name="city" value={newAddress.city} onChange={handleAddressChange} placeholder="Ville" required />
            <input type="text" name="state" value={newAddress.state} onChange={handleAddressChange} placeholder="État/Région" required />
            <input type="text" name="postalcode" value={newAddress.postalcode} onChange={handleAddressChange} placeholder="Code postal" required />
            <input type="text" name="country" value={newAddress.country} onChange={handleAddressChange} placeholder="Pays" required />
            <div className={styles.buttonContainer}>
              <button className={styles.cancelButton} onClick={() => setShowAddressForm(false)}>Annuler</button>
              <button onClick={handleSubmitAddress}>Ajouter</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AddressForm;