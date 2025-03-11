import React, { useEffect } from 'react';
import { useInitialData } from '../hooks/useInitialData';
import LoadingSpinner from './LoadingSpinner';
import useStore from '../store/store';
import AuthService from '../js/authService';

const DataLoader = ({ children }) => {
  const { userClubs, currentUser, setItems } = useStore();
  const isAuthenticated = AuthService.isAuthenticated();
  const [isLoading, error] = isAuthenticated ? useInitialData() : [false, null];

  useEffect(() => {
    if (isAuthenticated) {
      const storedUserData = AuthService.getUserData();
      const storedUserClubs = AuthService.getUserClubs();

      if (storedUserData && (!currentUser || Array.isArray(currentUser))) {
        setItems('currentUser', storedUserData);
      }

      if (storedUserClubs && Array.isArray(storedUserClubs) && (!userClubs || !userClubs.length)) {
        setItems('userClubs', storedUserClubs);
      }

      // Si après la synchronisation les données sont toujours invalides, déconnecter l'utilisateur
      if (!storedUserData || Array.isArray(storedUserData)) {
        console.error("Format des données utilisateur invalide - déconnexion");
        AuthService.logout();
        window.location.reload();
      }
    }
  }, [isAuthenticated, currentUser, userClubs, setItems]);

  useEffect(() => {
    if (isAuthenticated && (!userClubs?.length || !currentUser?.id)) {
      console.error("Données utilisateur manquantes", {
        userClubs: userClubs || 'non défini',
        currentUser: currentUser || 'non défini',
        userClubsLength: userClubs?.length,
        hasCurrentUserId: Boolean(currentUser?.id)
      });
    }
  }, [isAuthenticated, userClubs, currentUser]);

  if (!isAuthenticated) {
    return children;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Erreur de chargement</h3>
        <p>{error.message}</p>
        <p>Veuillez rafraîchir la page ou vous reconnecter.</p>
      </div>
    );
  }

  if (!userClubs?.length || !currentUser?.id) {
    return (
      <div className="error-container">
        <h3>Données utilisateur manquantes</h3>
        <p>Impossible de charger les données utilisateur.</p>
        <p>État actuel :</p>
        <ul>
          <li>Clubs utilisateur : {userClubs?.length ? 'Présent' : 'Manquant'}</li>
          <li>Utilisateur : {currentUser?.id ? 'Présent' : 'Manquant'}</li>
        </ul>
      </div>
    );
  }

  return children;
};

export default DataLoader;