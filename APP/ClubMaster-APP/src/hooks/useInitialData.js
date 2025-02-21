import { useState, useEffect } from 'react';
import useStore from '../store/store';
import api from '../js/App/Api';

export const useInitialData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userClubs, currentUser, lastFetchTime, setItems } = useStore();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        if (!userClubs?.length || !currentUser?.id) {
          if (!userClubs?.length) {
            console.error("Données des clubs de l'utilisateur manquantes", { userClubs, currentUser });
            setError(new Error("Données des clubs de l'utilisateur manquantes"));
            setIsLoading(false);
            return;
          }
          if (!currentUser?.id) {
            console.error("Données de l'utilisateur manquantes", { userClubs, currentUser });
            setError(new Error("Données de l'utilisateur manquantes"));
            setIsLoading(false);
            return;
          }
        }

        const now = Date.now();
        const minBeforeData = 20 * 60 * 1000;
        if (lastFetchTime && now - lastFetchTime < minBeforeData) {
          setIsLoading(false);
          return;
        }

        const arrayClubId = userClubs.map(club => club.id);
        if (!arrayClubId.length) {
          setIsLoading(false);
          return;
        }

        const [
          typeEventData,
          teamData,
          photosData,
          infoBannerData
        ] = await Promise.all([
          api.get("/eventType", { params: { arrayClubId: JSON.stringify(arrayClubId)} }),
          api.get("/team", { params: { arrayClubId: JSON.stringify(arrayClubId)} }),
          api.get("/photos", { params: { arrayClubId: JSON.stringify(arrayClubId)} }),
          api.get("/infoBanner", { params: { arrayClubId: JSON.stringify(arrayClubId)} })
        ]);

        if (!isMounted) return;

        setItems('typesEvent', typeEventData);
        setItems('teams', teamData);
        setItems('photos', photosData);
        setItems('infoBanners', infoBannerData);

        const arrayEventTypeId = typeEventData.map(type => type.id);
        const eventData = await api.get("/event", { params: { arrayEventTypeId: JSON.stringify(arrayEventTypeId) } });
        setItems('events', eventData);

        const matchTeamData = await api.get("/matchTeam", { params: { arrayTeamId: JSON.stringify(teamData.map(team => team.id)) } });
        setItems('matchTeams', matchTeamData);

        const matchScoreData = await api.get("/matchScore", { params: { arrayMatchTeamId: JSON.stringify(matchTeamData.map(matchTeam => matchTeam.id)) } });
        setItems('matchScores', matchScoreData);

        const arrayEventId = eventData.map(evnt => evnt.id);
        const inscriptionData = await api.get("/inscription", { params: { arrayEventId: JSON.stringify(arrayEventId), personPhysicId : currentUser.id } });
        setItems('inscriptions', inscriptionData);
        
        const addressData = await api.get("/address");
        setItems('addresses', addressData);

        const licenceData = await api.get("/licence", { params: { personphysicid: currentUser.id } });
        setItems('licences', licenceData);

        const typeLicencesData = await api.get("/licenceType", { params: { arrayClubId: JSON.stringify(arrayClubId)} });
        setItems('licenceTypes', typeLicencesData);

        const roleData = await api.get("/role", { params: { arrayClubId: JSON.stringify(arrayClubId)} });
        setItems('roles', roleData);

        const userRoles = roleData.filter(role => licenceData.some(lic => lic.roleid === role.id));
        setItems('currentUserRoles', userRoles);

        useStore.setState({ lastFetchTime: now });
        setIsLoading(false);
      } catch (error) {
        if (isMounted) {
          console.error("Erreur lors de la récupération des données :", error);
          setError(error);
          setIsLoading(false);
        }
      }
    };
    
    if (userClubs?.length > 0 && currentUser) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [userClubs, currentUser, lastFetchTime, setItems]);

  return [isLoading, error];
}; 