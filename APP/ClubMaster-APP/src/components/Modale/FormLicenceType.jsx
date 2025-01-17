import React, { useState } from 'react';
import api from '../../js/App/Api';
import styles from '../../styles/ModaleFormLicenceType.module.css';
import Modal from 'react-modal';

const FormLicenceType = ({ isOpen, onClose, licenceType = null }) => {
    const [formData, setFormData] = useState({
        label: licenceType?.label || '',
        duration: licenceType?.duration || 365,
        clubId: licenceType?.clubid || '',
        price: licenceType?.price || null,
        basic: licenceType?.basic || false
    });

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
                basic: formData.basic
            };

            if (licenceType) {
                // Mode modification
                await api.put(`/licenceType/${licenceType.id}`, payload);
            } else {
                // Mode création
                await api.post('/licenceType', payload);
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

                <div className={styles.checkboxContainer}>
                    <label>
                        <input
                            type="checkbox"
                            name="basic"
                            checked={formData.basic}
                            onChange={handleChange}
                        />
                        Licence de base
                    </label>
                </div>

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