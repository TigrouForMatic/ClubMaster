import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styles from '../../styles/FindClubOption.module.css';
import Select from 'react-select';
import { toSqlDate, getDateEndLicence } from '../../js/date';
import useStore from '../../store/store';

// Correction : Ajout de la prop manquante key
const ClubCard = React.memo(({ club, onClick }) => (
  <li className={styles.clubCard} onClick={() => onClick(club)}>
    <h3 className={styles.clubTitle}>{club.label}</h3>
  </li>
));

const FindClubOption = () => {
  const [error, setError] = useState(null);
  const [nomClub, setNomClub] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const clubsPerPage = 10;

  // Optimisation : Destructuration plus complète du store
  const { clubs, addresses, setItems, addItem, currentUser, setShowApp } = useStore((state) => ({
    clubs: state.clubs || [],
    addresses: state.addresses || [],
    setItems: state.setItems,
    addItem: state.addItem,
    currentUser: state.currentUser,
    setShowApp: state.setShowApp // Ajout de setShowApp
  }));

  // Correction : Ajout de la variable API_BASE_URL manquante
  const API_BASE_URL = 'http://localhost:3200/api';

  const fetchData = useCallback(async (endpoint) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`);
      if (!response.ok) throw new Error(`Erreur lors de la récupération des données de ${endpoint}`);
      return await response.json();
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
      return [];
    }
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      const [clubsData, addressesData] = await Promise.all([
        fetchData('club'),
        fetchData('address')
      ]);
      setItems('clubs', clubsData);
      setItems('addresses', addressesData);
    };
    
    fetchAllData();
  }, [fetchData, setItems]);

  const filteredClubs = useMemo(() => {
    return clubs.filter((club) => {
      const isNameMatch = club.label.toLowerCase().includes(nomClub.toLowerCase());
      if (!selectedLocation || selectedLocation.value === 'all') return isNameMatch;
      
      const clubAddress = addresses.find(add => add.id === club.addressid);
      const isLocationMatch = clubAddress && 
        clubAddress.postalcode === selectedLocation.postalcode && 
        clubAddress.city === selectedLocation.city;
      
      return isNameMatch && isLocationMatch;
    });
  }, [clubs, addresses, nomClub, selectedLocation]);

  // Correction : Correction de la déclaration de handleClick
  const handleClick = useCallback(async (club) => {
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

      // Récupération du rôle de visiteur
      const roleData = await fetchData(`/role`, 'GET');

      const roleId = roleData.find(role => role.clubid === club.id && role.level === 0)?.id;
      if (roleId === undefined) {
        console.error(`Aucun rôle trouvé pour le club ${club.id} avec le niveau 0`);
      }

      // Récupération du type de Licence
      const licenceTypeData = await fetchData(`/licenceType`, 'GET');

      const licenceTypeId = licenceTypeData.find(licTyp => licTyp.clubid === club.id && licTyp.label === "Licence Adulte")?.id;
      if (licenceTypeId === undefined) {
        console.error(`Aucun type de licence trouvé pour le club ${club.id} avec le nom Licence Adulte`);
      }

      // Création de la licence
      const licenceData = await fetchData('/licence', 'POST', {
        label: "Licence Visiteur",
        dd: toSqlDate(new Date()),
        df: toSqlDate(getDateEndLicence()),
        licenceTypeId: licenceTypeId,
        personPhysicId: currentUser.id,
        roleId: roleId,
      });

      addItem('licences', licenceData);

      const createdClubNotif = {
        label: `Club rejoint avec succès !! Vous êtes désormais visiteur de ${club.label}`,
        time: new Date()
      };
      addItem('notifications', createdClubNotif);
      addItem('userClubs', club);
      setShowApp();
    } catch (err) {
      console.error('Erreur lors de la création du club:', err.message);
      setError(err.message);
    }
  }, [addItem, currentUser, setShowApp, API_BASE_URL]);

  const locations = useMemo(() => {
    if (!addresses || addresses.length === 0) return [];
  
    const uniqueLocations = new Map();
  
    addresses
      .filter(add => add && add.postalcode && add.city)
      .forEach(add => {
        const key = `${add.postalcode}:${add.city}`;
        if (!uniqueLocations.has(key)) {
          uniqueLocations.set(key, {
            value: add.id,
            label: `${add.postalcode} : ${add.city}`,
            postalcode: add.postalcode,
            city: add.city
          });
        }
      });
  
    const sortedLocations = Array.from(uniqueLocations.values())
      .sort((a, b) => a.label.localeCompare(b.label));

    return [
      { value: 'all', label: 'Toutes les locations' },
      ...sortedLocations
    ];
  
  }, [addresses]);

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  const indexOfLastClub = currentPage * clubsPerPage;
  const indexOfFirstClub = indexOfLastClub - clubsPerPage;
  const currentClubs = filteredClubs.slice(indexOfFirstClub, indexOfLastClub);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className={styles.findClubContainer}>
      <div className={styles.filters}>
        <div className={styles.filterSection}>
          <h3>Nom</h3>
          <input
            type="text"
            placeholder="Nom du club"
            value={nomClub}
            onChange={(e) => setNomClub(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.filterSection}>
          <h3>Lieu</h3>
          <Select
            options={locations}
            className={styles.select}
            onChange={setSelectedLocation}
            placeholder="Sélectionner un lieu"
            value={selectedLocation}
          />
        </div>
      </div>

      <ul className={styles.clubsList}>
        {currentClubs.length > 0 ? (
          currentClubs.map((club) => (
            <ClubCard key={club.id} club={club} onClick={handleClick} />
          ))
        ) : (
          <p className={styles.noClubs}>Aucun club ne correspond à ces critères.</p>
        )}
      </ul>

      <div className={styles.pagination}>
        {Array.from({ length: Math.ceil(filteredClubs.length / clubsPerPage) }, (_, i) => (
          <button key={i} onClick={() => paginate(i + 1)} className={styles.pageButton}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FindClubOption;