import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import styles from '../../styles/FindClubOption.module.css';
import Select from 'react-select';

const ClubCard = React.memo(({ club, onClick }) => (
  <div className={styles.clubCard} onClick={() => onClick(club)}>
    <div className={styles.clubHeader}>
      <h3 className={styles.clubTitle}>{club.label}</h3>
    </div>
  </div>
));

const FindClubOption = () => {
  const [clubs, setClubs] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [error, setError] = useState(null);
  const [nomClub, setNomClub] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);

  const fetchData = useCallback(async (endpoint, setter) => {
    try {
      const response = await fetch(`http://localhost:3200/api/${endpoint}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error(`Erreur lors de la récupération des données de ${endpoint}`);

      const data = await response.json();
      setter(data);
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
    }
  }, []);

  useEffect(() => {
    fetchData('club', setClubs);
    fetchData('address', setAddresses);
  }, [fetchData]);

  const filteredClubs = useMemo(() => {
    return clubs.filter((club) => {
      const isNameMatch = club.label.toLowerCase().includes(nomClub.toLowerCase());
      const isLocationMatch = !selectedLocation || club.addressId === selectedLocation.value;
      return isNameMatch && isLocationMatch;
    });
  }, [clubs, nomClub, selectedLocation]);

  const handleClick = useCallback((club) => {
    console.log(club);
  }, []);

  const locations = useMemo(() => {
    return addresses
      .sort((a, b) => a.postalCode.localeCompare(b.postalCode))
      .map(add => ({
        value: add.id,
        label: `${add.postalCode} : ${add.city}`
      }));
  }, [addresses]);

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div>
      <div className={styles.filters}>
        <div className={styles.filterSection}>
          <h3>Nom</h3>
          <input
            type="text"
            placeholder="Nom du club"
            value={nomClub}
            onChange={(e) => setNomClub(e.target.value)}
          />
        </div>

        <div className={styles.filterSection}>
          <h3>Lieu</h3>
          <Select
            options={locations}
            className={styles.select}
            onChange={setSelectedLocation}
            placeholder="Sélectionner un lieu"
          />
        </div>
      </div>

      <div className={styles.clubsList}>
        {filteredClubs.length > 0 ? (
          filteredClubs.map((club) => (
            <ClubCard key={club.id} club={club} onClick={handleClick} />
          ))
        ) : (
          <p className={styles.noClubs}>Aucun club ne correspond à ces critères.</p>
        )}
      </div>
    </div>
  );
};

export default FindClubOption;