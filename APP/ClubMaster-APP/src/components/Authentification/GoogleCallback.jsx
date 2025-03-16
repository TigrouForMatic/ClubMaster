import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useStore from '../../store/store';
import AuthService from '../../js/authService';
import api from '../../js/App/Api';

function GoogleCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');

        if (!code) {
          throw new Error('Code d\'autorisation manquant');
        }

        // Vérifier que l'API est correctement configurée
        if (!api || !api.axios || !api.axios.defaults) {
          throw new Error('Configuration de l\'API invalide');
        }

        try {
          const response = await api.post('/auth/google/callback', { code });

          if (!response) {
            throw new Error('Réponse invalide du serveur');
          }

          const { token, user } = response;

          if (!token || !user) {
            throw new Error('Token ou données utilisateur manquants');
          }

          const loginData = {
            id: user.id,
            login: user.login,
            token: token,
            pseudo: user.pseudo
          }

          // Stocker le token et les données utilisateur
          AuthService.setLogin(loginData);

          // Mettre à jour le store
          useStore.setState({
            login: loginData,
            lastFetchTime: null
          });

          try {
            const dataPersonPhysic = await api.get('/login/'+user.id);

            if (dataPersonPhysic) {
              useStore.setState({
                currentUser: dataPersonPhysic
              });

              AuthService.setUserData(dataPersonPhysic[0]);

              const dataCurrentUserAddresses = await api.get(`/address/personnel/${dataPersonPhysic[0].id}`);

              const dataClub = await api.get(`/club/personnel/${dataPersonPhysic[0].id}`);

              if (dataClub?.length) {
                useStore.setState({
                  currentUserAddresses: dataCurrentUserAddresses,
                  userClubs: dataClub
                });

                AuthService.setUserClubs(dataClub);

                navigate('/');
              } else {
                navigate('/find-club');
              }
            } else {
              navigate('/personal-info');
            }
          } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
            AuthService.logout();
            navigate('/auth/login');
          }
        } catch (error) {
          console.error("Erreur détaillée:", {
            message: error.message,
            status: error?.response?.status,
            statusText: error?.response?.statusText,
            data: error?.response?.data
          });
          throw error;
        }
      } catch (error) {
        console.error('Erreur lors du callback Google:', error);
        AuthService.logout();
        navigate('/auth/login');
      }
    };

    handleCallback();
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900 mx-auto"></div>
        <p className="mt-4 text-zinc-600">Authentification en cours...</p>
      </div>
    </div>
  );
}

export default GoogleCallback;