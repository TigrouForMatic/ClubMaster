import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styles from '../../styles/FindClubOption.module.css';
import Select from 'react-select';
import useStore from '../../store/store';

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

  const { clubs, addresses, setItems, addItem } = useStore((state) => ({
    clubs: state.clubs || [],
    addresses: state.addresses || [],
    setItems: state.setItems,
    addItem: state.addItem
  }));

  const fetchData = useCallback(async (endpoint) => {
    try {
      const response = await fetch(`http://localhost:3200/api/${endpoint}`);
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

  const handleClick = useCallback((club) => {
    console.log(club);
    addItem('userClubs', club);
  }, [addItem]);

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