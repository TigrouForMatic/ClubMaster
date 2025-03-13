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
      console.log("3 handleCallback");
      try {
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');

        console.log("code", code);

        if (!code) {
          throw new Error('Code d\'autorisation manquant');
        }

        console.log("Envoi de la requête à l'API avec le code:", code);
        try {
          // Vérifier la configuration de l'API
          console.log("Configuration API:", api.defaults);
          
          const response = await api.post('/auth/google/callback', { code }, {
            // Ajouter des options de débogage
            validateStatus: function (status) {
              return true; // Accepter tous les status codes pour le débogage
            },
            timeout: 10000, // Timeout de 10 secondes
          });
          
          console.log("Status de la réponse:", response?.status);
          console.log("Headers de la réponse:", response?.headers);
          console.log("Response brute complète:", JSON.stringify(response, null, 2));
          console.log("Response.data:", response?.data);

          if (!response || !response.data) {
            throw new Error('Réponse invalide du serveur: ' + JSON.stringify(response));
          }

          const { token, user } = response.data;
          console.log("Token reçu:", token);
          console.log("User reçu:", user);

          if (!token || !user) {
            throw new Error('Token ou données utilisateur manquants. Données reçues: ' + JSON.stringify(response.data));
          }

          // Stocker le token et les données utilisateur
          AuthService.setToken(token);
          AuthService.setUserData(user);

          // Mettre à jour le store
          useStore.setState({
            login: {
              id: user.id,
              login: user.login,
              token: token,
              pseudo: user.pseudo
            },
            lastFetchTime: null
          });

          try {
            const dataPersonPhysic = await api.get('/personPhysic', { 
              params: { loginId: user.id } 
            });

            if (dataPersonPhysic.length) {
              useStore.setState({
                currentUser: dataPersonPhysic[0]
              });

              const dataCurrentUserAddresses = await api.get(`/address/personnel/${dataPersonPhysic[0].id}`);
              const dataClub = await api.get(`/club/personnel/${dataPersonPhysic[0].id}`);

              useStore.setState({
                currentUserAddresses: dataCurrentUserAddresses,
                userClubs: dataClub
              });

              navigate(dataClub.length ? '/' : '/find-club');
            } else {
              navigate('/personal-info');
            }
          } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
            AuthService.logout();
            navigate('/login?error=data_fetch_failed');
          }
        } catch (error) {
          console.error("Erreur détaillée:", {
            message: error.message,
            status: error?.response?.status,
            statusText: error?.response?.statusText,
            data: error?.response?.data,
            config: error?.config,
            baseURL: api.defaults.baseURL
          });
          throw error;
        }
      } catch (error) {
        console.error('Erreur lors du callback Google:', error);
        AuthService.logout();
        navigate('/login?error=google_auth_failed');
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