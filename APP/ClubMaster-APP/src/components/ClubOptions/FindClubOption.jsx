import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styles from '../../styles/FindClubOption.module.css';
import Select from 'react-select';
import { toSqlDate, getDateEndLicence } from '../../js/date';
import useStore from '../../store/store';
import api from '../../js/App/Api'; // Importez le contrôleur API

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

  const { clubs, addresses, setItems, addItem, currentUser, setShowApp } = useStore((state) => ({
    clubs: state.clubs || [],
    addresses: state.addresses || [],
    setItems: state.setItems,
    addItem: state.addItem,
    currentUser: state.currentUser,
    setShowApp: state.setShowApp
  }));

  const fetchData = useCallback(async (endpoint) => {
    try {
      return await api.get(endpoint);
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
      
      const clubAddress = addresses.find(add => add.referenceid === club.id);
      const isLocationMatch = clubAddress && 
        clubAddress.postalcode === selectedLocation.postalcode && 
        clubAddress.city === selectedLocation.city;
      
      return isNameMatch && isLocationMatch;
    });
  }, [clubs, addresses, nomClub, selectedLocation]);

  const handleClick = useCallback(async (club) => {
    try {
      const fetchData = async (url, method, body = null) => {
        if (method === 'GET') {
          return await api.get(url);
        } else if (method === 'POST') {
          return await api.post(url, body);
        }
      };

      const roleData = await fetchData(`/role`, 'GET');
      const roleId = roleData.find(role => role.clubid === club.id && role.level === 0)?.id;
      if (roleId === undefined) {
        console.error(`Aucun rôle trouvé pour le club ${club.id} avec le niveau 0`);
      }

      const licenceTypeData = await fetchData(`/licenceType`, 'GET');
      const licenceTypeId = licenceTypeData.find(licTyp => licTyp.clubid === club.id && licTyp.label === "Licence Visiteur")?.id;
      if (licenceTypeId === undefined) {
        console.error(`Aucun type de licence trouvé pour le club ${club.id} avec le nom Licence Adulte`);
      }

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
  }, [addItem, currentUser, setShowApp]);

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
      <h1 className={styles.title}>Trouver un Club</h1>
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