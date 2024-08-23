import React, { useState, useMemo, useEffect, useCallback } from "react";
import styles from "../styles/ManageView.module.css";
import useStore from '../store/store';
import api from "../js/App/Api";
import { getDisplayFormatedDate, daysToYearMonthDay } from '../js/date';
import UserImage from "../components/UserImage";
import { BirthdayCake } from 'iconoir-react';

function ManageView() {
  const { userClubs, currentUserRoles, typesEvent, licenceTypes, productTypes, roles } = useStore();
  const [licences, setLicences] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedClubId, setSelectedClubId] = useState(userClubs[0].id);

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
    console.log(licenceTypes)
  }, [licenceTypes]);

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
    // Créer des Map pour un accès rapide aux types de licence et aux rôles
    const licenceTypeMap = new Map(licenceTypes.map(type => [type.id, type]));
    const roleMap = new Map(roles.map(role => [role.id, role]));
  
    // Filtrer et transformer les licences en une seule passe
    return licences
      .filter(licence => {
        const licenceType = licenceTypeMap.get(licence.licencetypeid);
        return licenceType && licenceType.clubid === selectedClubId;
      })
      .map(licence => {
        const licenceType = licenceTypeMap.get(licence.licencetypeid);
        const role = roleMap.get(licence.roleid);
        return {
          ...licence,
          type: licenceType ? licenceType.label : undefined,
          role: role ? role.label : undefined
        };
      });
  
  }, [licences, licenceTypes, roles, selectedClubId]);

  const filteredLicenceTypes = useMemo(() => {
    return licenceTypes.filter(type => selectedClubId ? type.clubid === selectedClubId : true);
  }, [licenceTypes, selectedClubId]);

  const filteredRoles = useMemo(() => {
    return roles.filter(role => selectedClubId ? role.clubid === selectedClubId : true).sort((a, b) => a.level - b.level);
  }, [roles, selectedClubId]);

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
      <LicenceTypeList licenceTypes={filteredLicenceTypes} />
      <RoleList roles={filteredRoles} />
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
          className={`${styles.clubItem} ${selectedClubId === club.id ? styles.active : ""}`}
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
          <th>Personne</th>
          <th>Licence</th>
          <th>Type</th>
          <th>Date de début</th>
          <th>Date de fin</th>
          <th>Role</th>
          <th>Contact</th>
        </tr>
      </thead>
      <tbody>
        {licences.map(licence => (
          <tr key={licence.id}>
            <td><UserImage name={licence.name} size={30} /> {licence.name} <BirthdayCake /> {getDisplayFormatedDate(new Date(licence.naissancedate))}</td>
            <td>{licence.label}</td>
            <td>{licence.type}</td>
            <td>{getDisplayFormatedDate(new Date(licence.dd))}</td>
            <td>{getDisplayFormatedDate(new Date(licence.df))}</td>
            <td>{licence.role}</td>
            <td>{licence.emailaddress} {licence.phonenumber}</td>
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

const LicenceTypeList = React.memo(({ licenceTypes }) => (
  <div className={styles.section}>
    <h2 className={styles.subtitle}>Types de licences</h2>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Label</th>
          <th>Prix</th>
          <th>Type</th>
          <th>Durée</th>
        </tr>
      </thead>
      <tbody>
        {licenceTypes.map(type => (
          <tr key={type.id}>
            <td>{type.label}</td>
            <td>{type.price !== null ? `${type.price} €` : 'Gratuit'}</td>
            <td>{type.basic ? 'Basic' : 'Advanced'}</td>
            <td>{daysToYearMonthDay(type.duration)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
));

const RoleList = React.memo(({ roles }) => (
  <div className={styles.section}>
    <h2 className={styles.subtitle}>Rôles</h2>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Label</th>
          <th>Niveau</th>
        </tr>
      </thead>
      <tbody>
        {roles.map(role => (
          <tr key={role.id}>
            <td>{role.label}</td>
            <td>{role.level}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
));

export default ManageView;