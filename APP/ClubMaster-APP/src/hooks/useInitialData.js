import { useState, useEffect } from 'react';
import useStore from '../store/store';
import api from '../js/App/Api';
import AuthService from '../js/authService';

export const useInitialData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userClubs, currentUser, currentUserAddresses, lastFetchTime, setItems, addItem } = useStore();

  const [usedUserData, setUsedUserData] = useState(null);
  const [usedUserClubs, setUsedUserClubs] = useState(null);

  useEffect(() => {
    const storedUserData = AuthService.getLogin();
    const storedUserClubs = AuthService.getUserClubs();
    
    if (storedUserData && (!currentUser || Array.isArray(currentUser))) {
      setItems('currentUser', storedUserData);
    }
    
    if (storedUserClubs && (!userClubs || !userClubs.length)) {
      setItems('userClubs', storedUserClubs);
    }
    
    setUsedUserData(storedUserData || currentUser);
    setUsedUserClubs(storedUserClubs || userClubs);
  }, []);

  useEffect(() => {
    if (currentUser && !Array.isArray(currentUser)) {
      setUsedUserData(currentUser);
    }
    if (userClubs && Array.isArray(userClubs)) {
      setUsedUserClubs(userClubs);
    }
  }, [userClubs, currentUser]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        // Vérifier si les données sont dans le localStorage
        const storedUserData = AuthService.getLogin();
        const storedUserClubs = AuthService.getUserClubs();

        // Si les données sont dans le localStorage mais pas dans le store, les ajouter
        if (storedUserData && !currentUser) {
          setItems('currentUser', storedUserData);
        }
        if (storedUserClubs && (!userClubs || !userClubs.length)) {
          setItems('userClubs', storedUserClubs);
        }

        // Si les données sont toujours manquantes après la synchronisation
        if (!usedUserClubs?.length || !usedUserData?.id) {
          if (!usedUserClubs?.length) {
            console.error("Données des clubs de l'utilisateur manquantes", { usedUserClubs, usedUserData });
            setError(new Error("Données des clubs de l'utilisateur manquantes"));
            setIsLoading(false);
            return;
          }
          if (!usedUserData?.id) {
            console.error("Données de l'utilisateur manquantes", { usedUserClubs, usedUserData });
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

        const arrayClubId = usedUserClubs.map(club => club.id);
        if (!arrayClubId.length) {
          setIsLoading(false);
          return;
        }

        if (!currentUserAddresses?.length) {
          // Récupérer l'adresse
          const dataCurrentUserAddresses = await api.get(`/address/personnel/${usedUserData.id}`);
          setItems('currentUserAddresses', dataCurrentUserAddresses);
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
        const inscriptionData = await api.get("/inscription", { params: { arrayEventId: JSON.stringify(arrayEventId), loginId : usedUserData.id } });
        setItems('inscriptions', inscriptionData);
        
        const addressData = await api.get("/address");
        setItems('addresses', addressData);

        const licenceData = await api.get("/licence", { params: { loginid: usedUserData.id } });
        setItems('licences', licenceData);

        const typeLicencesData = await api.get("/licenceType", { params: { arrayClubId: JSON.stringify(arrayClubId)} });
        setItems('licenceTypes', typeLicencesData);

        const roleData = await api.get("/role", { params: { arrayClubId: JSON.stringify(arrayClubId)} });
        setItems('roles', roleData);

        const userRoles = roleData.filter(role => licenceData.some(lic => lic.roleid === role.id));
        setItems('currentUserRoles', userRoles);

        const requestToJoinData = await api.get("/requestToJoin", { params: { userid: usedUserData.id, arrayClubId: JSON.stringify(arrayClubId) } });
        setItems('requestToJoin', requestToJoinData);

        const membershipFormData = await api.get("/membershipForm", { params: { arrayClubId: JSON.stringify(arrayClubId)} });
        setItems('membershipForms', membershipFormData);

        if (userRoles.some(role => role.level >= 3)) {
          // Récupération des id des clubs admin
          const arrayClubIdAdmin = [];
          for (const role of userRoles) {
            if (role.level >= 3) {
              arrayClubIdAdmin.push(role.clubid);
            }
          }

          // Récupération des licences pour les clubs admin
          const licenceAdminData = await api.get("/licence/manage", { params: { arrayClubId: JSON.stringify(arrayClubIdAdmin)}});
          setItems('licencesAdmin', licenceAdminData);

          // Récupération des demandes d'adhésion pour les clubs admin
          const requestToJoinData = await api.get("/requestToJoin", { params: { arrayClubId: JSON.stringify(arrayClubIdAdmin) } });
          setItems('requestToJoinAdmin', requestToJoinData);

          const arrayClubRequest = [];
          arrayClubIdAdmin.forEach(clubAdmin => {
            const request = requestToJoinData.filter(request => request.clubid == clubAdmin);
            if (request.length > 0) {
              arrayClubRequest.push({
                label: request[0].clublabel,
                number: request.length
              });
            }
          });

          if (arrayClubRequest.length > 0) {
            for (const clubRequest of arrayClubRequest) {
              if (clubRequest.number == 1) {
                addItem('notifications', {
                  label: `Demande d'une nouvelle adhésion à ${clubRequest.label}`,
                  time: new Date()
                });
              } else {
                addItem('notifications', {
                  label: `Demande de ${clubRequest.number} nouvelles adhésions à ${clubRequest.label}`,
                  time: new Date()
                });
              }
            }
          }
        }
        
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
    
    if (usedUserClubs?.length > 0 && usedUserData) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [usedUserClubs, usedUserData, currentUserAddresses, lastFetchTime, setItems]);

  return [isLoading, error];
}; 