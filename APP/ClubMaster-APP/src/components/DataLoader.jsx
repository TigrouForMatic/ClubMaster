import React from 'react';
import { useInitialData } from '../hooks/useInitialData';
import LoadingSpinner from './LoadingSpinner';
import useStore from '../store/store';

const DataLoader = ({ children }) => {
  const { userClubs, currentUser } = useStore();
  const [isLoading, error] = useInitialData();

  if (!userClubs?.length || !currentUser?.id) {
    console.error("Données utilisateur manquantes", { userClubs, currentUser });
    return <div>Erreur : Données utilisateur manquantes</div>;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Erreur de chargement : {error.message}</div>;
  }

  return children;
};

export default DataLoader;