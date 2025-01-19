import React, { useState, useMemo, useEffect, useCallback } from "react";
import styles from "../styles/ManageView.module.css";
import useStore from '../store/store';
import api from "../js/App/Api";
import ClubList from "../components/Manager/ClubList";
import LicenceList from "../components/Manager/LicenceList";
import EventTypeList from "../components/Manager/EventTypeList";
import LicenceTypeList from "../components/Manager/LicenceTypeList";
import RoleList from "../components/Manager/RoleList";

function ManageView() {
  const { userClubs, currentUserRoles, typesEvent, licenceTypes, productTypes, roles } = useStore();
  const [licences, setLicences] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedClubId, setSelectedClubId] = useState(userClubs[0].id);

  const fetchLicences = useCallback(async (filteredClubs) => {
    try {
      setIsLoading(true);
      const arrayClubId = filteredClubs.map(club => club.id);
      const licenceData = await api.get("/licence/manage", { params: { arrayClubId: JSON.stringify(arrayClubId)}});
      setLicences(licenceData);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const filteredClubs = useMemo(() => {
    const highLevelClubIds = new Set(
      currentUserRoles
        .filter(role => role.level >= 3)
        .map(role => role.clubid)
    );

    return userClubs.filter(club => highLevelClubIds.has(club.id) && club.personmoralplan === 'Pro');
  }, [userClubs, currentUserRoles]);

  useEffect(() => {
    fetchLicences(filteredClubs); 
  }, [filteredClubs, fetchLicences]);

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
          <span className={styles.selectedClubName}>{filteredClubs[0].label}</span>
        </div>
      )}

      {filteredClubs.length > 1 && (
        <ClubList clubs={filteredClubs} selectedClubId={selectedClubId} onClubSelect={handleClubSelect} />
      )}

      <LicenceList licences={filteredLicences} licenceTypes={filteredLicenceTypes} roles={filteredRoles} />

      {filteredLicences && filteredLicences.length > 0 && (
        <div className={styles.countLicencesContainer}>
          <span className={styles.countLicences}>{filteredLicences.length} adhérents</span>
        </div>
      )}
      <LicenceTypeList licenceTypes={filteredLicenceTypes} selectedClubId={selectedClubId} />
      <RoleList roles={filteredRoles} />
      <EventTypeList types={filteredTypes} />
    </div>
  );
}

export default ManageView;