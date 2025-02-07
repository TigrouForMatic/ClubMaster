import React, { useState } from 'react';
import api from '../../js/App/Api';
import useStore from '../../store/store';
import { EditPencil, Trash } from 'iconoir-react';
import CustomConfirm from '../CustomConfirm';

function AddressForm() {
    const addItem = useStore((state) => state.addItem);
    const updateItem = useStore((state) => state.updateItem);
    const deleteItem = useStore((state) => state.deleteItem);
    const { currentUser, currentUserAddresses } = useStore();
    const [confirmDeleteAddressOpen, setConfirmDeleteAddressOpen] = useState(false);
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
        <div className="space-y-6">
            {currentUserAddresses.map((add) => (
                <div key={add.id}>
                    {editAddress === null || editAddress.id !== add.id ? (
                        <div className="relative p-6 rounded-lg border border-gray-200 bg-white shadow-sm hover:border-gray-300 transition-colors">
                            <div className="space-y-2">
                                <p className="text-sm text-gray-900 font-medium">{add.street}</p>
                                <p className="text-sm text-gray-600">{add.postalcode} {add.city}</p>
                                <p className="text-sm text-gray-600">{add.state}, {add.country}</p>
                            </div>
                            <div className="absolute top-4 right-4 flex flex-col gap-2">
                                <button 
                                    onClick={() => handleEditAddress(add)}
                                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                                >
                                    <EditPencil className="h-4 w-4" />
                                </button>
                                <button 
                                    // onClick={() => setConfirmDeleteAddressOpen(true)}
                                    onClick={() => handleDeleteAddress(editAddress.id)}
                                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                                >
                                    <Trash className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 rounded-lg border border-gray-200 bg-white shadow-sm">
                            <h3 className="text-lg font-semibold mb-4">Modifier l'adresse</h3>
                            <form onSubmit={handleSubmitEditAddress} className="space-y-4">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Rue</label>
                                        <input
                                            type="text"
                                            name="street"
                                            value={editAddress.street}
                                            onChange={handleEditAddressChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Ville</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={editAddress.city}
                                                onChange={handleEditAddressChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Code postal</label>
                                            <input
                                                type="text"
                                                name="postalcode"
                                                value={editAddress.postalcode}
                                                onChange={handleEditAddressChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">État/Région</label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={editAddress.state}
                                                onChange={handleEditAddressChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Pays</label>
                                            <input
                                                type="text"
                                                name="country"
                                                value={editAddress.country}
                                                onChange={handleEditAddressChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setEditAddress(null)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Modifier
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            ))}

            {!showAddressForm ? (
                <button
                    onClick={handleAddAddress}
                    className="w-full px-4 py-3 text-sm font-medium text-blue-600 bg-white border-2 border-blue-600 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                    Ajouter une adresse
                </button>
            ) : (
                <div className="p-6 rounded-lg border border-gray-200 bg-white shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">Ajouter une adresse</h3>
                    <form onSubmit={handleSubmitAddress} className="space-y-4">
                        <div className="space-y-4">
                            <input
                                type="text"
                                name="street"
                                value={newAddress.street}
                                onChange={handleAddressChange}
                                placeholder="Rue"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="city"
                                    value={newAddress.city}
                                    onChange={handleAddressChange}
                                    placeholder="Ville"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                <input
                                    type="text"
                                    name="postalcode"
                                    value={newAddress.postalcode}
                                    onChange={handleAddressChange}
                                    placeholder="Code postal"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="state"
                                    value={newAddress.state}
                                    onChange={handleAddressChange}
                                    placeholder="État/Région"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                <input
                                    type="text"
                                    name="country"
                                    value={newAddress.country}
                                    onChange={handleAddressChange}
                                    placeholder="Pays"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                type="button"
                                onClick={() => setShowAddressForm(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Ajouter
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <CustomConfirm
                isOpen={confirmDeleteAddressOpen}
                onClose={() => setConfirmDeleteAddressOpen(false)}
                onConfirm={() => handleDeleteAddress(editAddress.id)}
                message="Voulez-vous vraiment supprimer cette adresse ?"
            />

        </div>
    );
}

export default AddressForm;