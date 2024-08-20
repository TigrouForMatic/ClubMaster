import React, { useState, useMemo, useEffect, useCallback } from "react";
import styles from "../styles/ManageView.module.css";
import useStore from '../store/store';
import api from "../js/App/Api";
import { getDisplayFormatedDate } from '../js/date';
import UserImage from "../components/UserImage";

function ManageView() {
  const { userClubs, currentUserRoles, typesEvent } = useStore();
  const [licences, setLicences] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedClubId, setSelectedClubId] = useState(null);

  const fetchLicences = useCallback(async (arrayRolesId) => {
    try {
      setIsLoading(true);
      const licenceData = await api.get("/licence/manage", { params: { roleIds: arrayRolesId } });
      setLicences(licenceData);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const highLevelRoleIds = useMemo(() => 
    currentUserRoles.filter(role => role.level >= 3).map(role => role.id),
  [currentUserRoles]);

  useEffect(() => {
    fetchLicences(highLevelRoleIds);
  }, [highLevelRoleIds, fetchLicences]);

  const filteredClubs = useMemo(() => {
    const highLevelClubIds = new Set(
      currentUserRoles
        .filter(role => role.level >= 3)
        .map(role => role.clubid)
    );

    return userClubs.filter(club => highLevelClubIds.has(club.id));
  }, [userClubs, currentUserRoles]);

  const filteredTypes = useMemo(() => {
    return typesEvent.filter(type => selectedClubId ? type.clubid === selectedClubId : true);
  }, [typesEvent, selectedClubId]);

  const filteredLicences = useMemo(() => {
    return licences.filter(licence => selectedClubId ? licence.clubid === selectedClubId : true);
  }, [licences, selectedClubId]);

  const handleClubSelect = (clubId) => {
    setSelectedClubId(clubId);
  };

  if (isLoading) return <div className={styles.loading}>Chargement...</div>;
  if (error) return <div className={styles.error}>Erreur : {error.message}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Tableau de bord</h1>
      {filteredClubs.length === 1 && (
        <div className={styles.selectedClub}>
          Club sélectionné : {filteredClubs[0].label}
        </div>
      )}
      <ClubList clubs={filteredClubs} selectedClubId={selectedClubId} onClubSelect={handleClubSelect} />
      <LicenceList licences={filteredLicences} />
      <EventTypeList types={filteredTypes} />
    </div>
  );
}

const ClubList = React.memo(({ clubs, selectedClubId, onClubSelect }) => (
  <div className={styles.section}>
    <h2 className={styles.subtitle}>Clubs</h2>
    <div className={styles.clubList}>
      {clubs.map(club => (
        <div
          key={club.id}
          className={`${styles.clubItem} ${club.id === selectedClubId ? styles.selectedClub : ''}`}
          onClick={() => onClubSelect(club.id)}
        >
          {club.label}
        </div>
      ))}
    </div>
  </div>
));

const LicenceList = React.memo(({ licences }) => (
  <div className={styles.section}>
    <h2 className={styles.subtitle}>Licenciés</h2>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Nom</th>
          <th>Licence</th>
          <th>Date de début</th>
          <th>Date de fin</th>
        </tr>
      </thead>
      <tbody>
        {licences.map(licence => (
          <tr key={licence.id}>
            <td><UserImage name={licence.name} size={30} /> {licence.name}</td>
            <td>{licence.label}</td>
            <td>{getDisplayFormatedDate(new Date(licence.dd))}</td>
            <td>{getDisplayFormatedDate(new Date(licence.df))}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
));

const EventTypeList = React.memo(({ types }) => (
  <div className={styles.section}>
    <h2 className={styles.subtitle}>Types d'événements</h2>
    <ul className={styles.list}>
      {types.map(type => (
        <li key={type.id}>{type.label}</li>
      ))}
    </ul>
  </div>
));

export default ManageView;