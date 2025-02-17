import React, { useState, useEffect } from 'react';
import useStore from '../../store/store';
import api from '../../js/App/Api';
import Modal from 'react-modal';

const FormLicenceType = ({ isOpen, onClose, selectedClubId, licenceType }) => {
    const [formData, setFormData] = useState({
        label: licenceType?.label || '',
        duration: licenceType?.duration || 365,
        clubId: selectedClubId,
        private: licenceType?.private || false,
        price: licenceType?.price || null,
        basic: licenceType?.basic || false
    });

    useEffect(() => {
        setFormData({
            label: licenceType?.label || '',
            duration: licenceType?.duration || 365,
            clubId: selectedClubId,
            private: licenceType?.private || false,
            price: licenceType?.price || null,
            basic: licenceType?.basic || false
        });
    }, [licenceType]);

    const addItem = useStore(state => state.addItem);
    const updateItem = useStore(state => state.updateItem);
    const typeLicence = useStore(state => state.licenceTypes);
    const basicTypeLicenceExist = typeLicence.find(type => type.basic === true);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                label: formData.label,
                duration: parseInt(formData.duration),
                clubid: parseInt(formData.clubId),
                price: formData.price ? parseFloat(formData.price) : null,
                basic: formData.basic,
                private: formData.private
            };

            if (licenceType) {
                await api.put(`/licenceType/${licenceType.id}`, payload);
                updateItem('licenceTypes', licenceType.id, payload);
            } else {
                await api.post('/licenceType', payload);
                addItem('licenceTypes', payload);
            }
            onClose();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du type de licence:', error);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl mx-auto mt-10 max-h-[90vh] overflow-y-auto scrollbar-hide"
            overlayClassName="fixed inset-0 bg-black/50 z-50 flex items-start justify-center"
        >
            <div className="p-6">
                <div className="flex items-center justify-between border-b pb-4">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        {licenceType ? 'Modifier le type de licence' : 'Créer un type de licence'}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="text-zinc-500 hover:text-zinc-900 transition-colors"
                    >
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="label" className="block text-sm font-medium text-zinc-700">
                            Nom du type de licence
                        </label>
                        <input
                            type="text"
                            id="label"
                            name="label"
                            value={formData.label}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded-md border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="duration" className="block text-sm font-medium text-zinc-700">
                            Durée (en jours)
                        </label>
                        <input
                            type="number"
                            id="duration"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            min="1"
                            required
                            className="w-full px-3 py-2 border rounded-md border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="price" className="block text-sm font-medium text-zinc-700">
                            Prix (€)
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            placeholder="Gratuit si vide"
                            className="w-full px-3 py-2 border rounded-md border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="private"
                                name="private"
                                checked={formData.private}
                                onChange={handleChange}
                                className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-zinc-700">Visible par tous</span>
                        </label>
                    </div>

                    {!basicTypeLicenceExist && (
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="basic"
                                    name="basic"
                                    checked={formData.basic}
                                    onChange={handleChange}
                                    disabled={basicTypeLicenceExist}
                                    className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-zinc-700">Licence de base</span>
                            </label>
                            <p className="text-sm text-zinc-500 mt-1">
                                Faire en sorte que cette licence soit sélectionnée par défaut lors de l'arrivée d'un nouveau membre.
                            </p>
                        </div>
                    )}

                    <div className="flex justify-end space-x-4 pt-6 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-md shadow-sm hover:bg-zinc-50"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700"
                        >
                            {licenceType ? 'Modifier' : 'Créer'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default FormLicenceType;