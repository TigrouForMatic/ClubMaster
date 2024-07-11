import React, { useState, useCallback } from 'react';
import styles from '../../styles/CreateClubOptions.module.css';
import { toSqlDate, getDateEndLicence } from '../../js/date';
import useStore from '../../store/store';

const API_BASE_URL = 'http://localhost:3200/api';

const CreateClubOption = ( onAuthenticate ) => {

  const addItem = useStore((state) => state.addItem);

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

  // Utilisation de useCallback pour mémoriser la fonction
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setClubData(prevData => ({
      ...prevData,
      ...(name.startsWith('address.') 
        ? { address: { ...prevData.address, [name.split('.')[1]]: value } }
        : { [name]: value })
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      // Fonction d'aide pour les requêtes fetch
      const fetchData = async (url, method, body = null) => {
        const response = await fetch(`${API_BASE_URL}${url}`, {
          method,
          headers,
          body: body ? JSON.stringify(body) : null,
        });
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return response.json();
      };

      // Création de l'adresse
      const { id: addressId } = await fetchData('/address/', 'POST', {
        ...clubData.address,
        private: false,
        validate: true
      });

      // Création du club
      const { id: clubId } = await fetchData('/club', 'POST', {
        label: clubData.label,
        addressId
      });

      // Création des types de licence
      const licenceTypeData = await fetchData(`/licenceType/newCLub/${clubId}`, 'POST');
      // Exemple : { id: 8, label: 'Licence Adulte', clubid: 12, price: null }
      if (!licenceTypeData || !licenceTypeData.id) {
        throw new Error('Données de type de licence invalides');
      }

      // Création des rôles
      const roleData = await fetchData(`/role/newCLub/${clubId}`, 'POST');
      if (!roleData || !roleData[1] || !roleData[1].id) {
        throw new Error('Données de rôle invalides');
      }

      // Avant d'utiliser personPhysic, parsez-le en JSON
      const personPhysic = JSON.parse(localStorage.getItem('personPhysic'));

      // Vérifiez si personPhysic existe et a un id avant de l'utiliser
      if (!personPhysic || !personPhysic.id) {
        throw new Error('Données personPhysic manquantes ou invalides');
      }

      // Création de la licence
      await fetchData('/licence', 'POST', {
        label: "Licence Président",
        dd: toSqlDate(new Date()),
        df: toSqlDate(getDateEndLicence()),
        licenceTypeId: licenceTypeData.id,
        personPhysicId: personPhysic.id,
        roleId: roleData[1].id,
      });

    } catch (err) {
      console.error('Erreur lors de la création du club:', err.message);
    } finally {
      const createdClubNotif = {
        label : `Club créé avec succès !! Vous etes desormais le président de ${clubData.label}`,
        time : new Date()
      };
      addItem('notifications', createdClubNotif);
      onAuthenticate();
    }
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
        
        {['street', 'city', 'state', 'postalCode', 'country'].map((field) => (
          <div key={field} className={styles.formGroup}>
            <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <input
              type="text"
              id={field}
              name={`address.${field}`}
              value={clubData.address[field]}
              onChange={handleChange}
            />
          </div>
        ))}
        
        <button type="submit">Créer le club</button>
      </form>
    </div>
  );
};

export default CreateClubOption;