import React, { useState, useEffect } from 'react';
import useStore from '../../store/store';
import api from '../../js/App/Api';
import styles from '../../styles/ModaleFormLicenceType.module.css';
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
                console.log('payload', licenceType);
                // Mode modification
                await api.put(`/licenceType/${licenceType.id}`, payload);
                updateItem('licenceTypes', licenceType.id, payload);
            } else {
                // Mode création
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
            className={styles.modal}
            overlayClassName={styles.modalOverlay}
        >
            <div className={styles.headerModal}>
                <h2 className={styles.title}>
                    {licenceType ? 'Modifier le type de licence' : 'Créer un type de licence'}
                </h2>
                <button onClick={onClose} className={styles.closeButton}>&times;</button>
            </div>

            <form onSubmit={handleSubmit} className={styles.content}>
                <div>
                    <label htmlFor="label">Nom du type de licence :</label>
                    <input
                        type="text"
                        id="label"
                        name="label"
                        value={formData.label}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="duration">Durée (en jours) :</label>
                    <input
                        type="number"
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        min="1"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="price">Prix (€) :</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        placeholder="Gratuit si vide"
                    />
                </div>

                <div className={styles.switchContainer}>
                    <label htmlFor="private">VIsible par tous ?</label>
                    <div className={styles.switchWrapper}>
                        <label className={styles.switch}>
                            <input
                                type="checkbox"
                                id="private"
                                name="private"
                                checked={formData.private}
                                onChange={handleChange}
                            />
                            <span className={styles.slider}></span>
                        </label>
                        <span className={styles.switchLabel}>
                            {formData.private ? 'Oui' : 'Non'}
                        </span>
                    </div>
                </div>

                {!basicTypeLicenceExist ? (
                    <div className={styles.switchContainer}>
                        <label htmlFor="basic">Licence de base</label>
                        <div className={styles.switchWrapper}>
                            <label className={styles.switch}>
                                <input
                                    type="checkbox"
                                    id="basic"
                                    name="basic"
                                    checked={formData.basic}
                                    onChange={handleChange}
                                    disabled={basicTypeLicenceExist}
                                />
                                <span className={styles.slider}></span>
                            </label>
                            <span className={styles.switchLabel}>
                                {formData.basic ? 'Oui' : 'Non'}
                            </span>
                        </div>
                        <span className={styles.helpText}>
                            Faire en sorte que cette licence soit sélectionnée par défaut lors de l'arrivée d'un nouveau membre.
                        </span>
                    </div>
                ) : null}
                
                <div className={styles.buttonContainer}>
                    <button type="button" onClick={onClose} className={styles.unregisterButton}>
                        Annuler
                    </button>
                    <button type="submit" className={styles.registerButton}>
                        {licenceType ? 'Modifier' : 'Créer'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default FormLicenceType;