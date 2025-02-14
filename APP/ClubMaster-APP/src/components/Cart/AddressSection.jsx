import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
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
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Adresse de facturation</h3>
      
      <div className="grid gap-3">
        {currentUserAddresses.map((add) => (
          <div
            key={add.id}
            className={`p-4 cursor-pointer transition-colors ${
              selectedAddressId === add.id ? 'border-primary' : 'hover:bg-accent'
            }`}
            onClick={() => onAddressSelect(add.id)}
          >
            <p className="text-sm">{add.street}</p>
            <p className="text-sm">{add.postalcode} {add.city}</p>
            <p className="text-sm text-muted-foreground">{add.state}, {add.country}</p>
          </div>
        ))}
      </div>

      <button
        className="p-2 border rounded-md flex items-center justify-center gap-2 hover:bg-gray-100"
        onClick={handleAddAddress}
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Ajouter une adresse
      </button>

      {showAddressForm && (
        <form onSubmit={handleSubmitAddress} className="space-y-4">
          <input
            type="text"
            name="street"
            value={newAddress.street}
            onChange={handleAddressChange}
            placeholder="Rue"
            required
          />
          <input
            type="text"
            name="city"
            value={newAddress.city}
            onChange={handleAddressChange}
            placeholder="Ville"
            required
          />
          <input
            type="text"
            name="state"
            value={newAddress.state}
            onChange={handleAddressChange}
            placeholder="État/Région"
            required
          />
          <input
            type="text"
            name="postalcode"
            value={newAddress.postalcode}
            onChange={handleAddressChange}
            placeholder="Code postal"
            required
          />
          <input
            type="text"
            name="country"
            value={newAddress.country}
            onChange={handleAddressChange}
            placeholder="Pays"
            required
          />
          <button type="submit" className="w-full p-2 border rounded-md flex items-center justify-center gap-2 hover:bg-gray-100">Ajouter</button>
        </form>
      )}
    </div>
  );
}

export default AddressSection;