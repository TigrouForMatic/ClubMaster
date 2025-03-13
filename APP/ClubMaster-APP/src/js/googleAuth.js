import api from '../js/App/Api';
import AuthService from './authService';

class GoogleAuthService {
  static async handleGoogleLogin() {
    // Les scopes doivent être séparés par des espaces et encodés
    const scopes = encodeURIComponent('email profile openid');
    
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}&` +
      `response_type=code&` +
      `scope=${scopes}&` +
      `redirect_uri=${encodeURIComponent('https://clubmaster.fr/auth/google/callback')}&` +
      `access_type=offline&` +
      `prompt=consent`;

    window.location.href = googleAuthUrl;
  }

  static async handleGoogleCallback(code) {
    try {
      const response = await api.post('/auth/google/callback', { code });
      
      if (response.token) {
        // Mettre à jour le store avec les informations de l'utilisateur
        const loginData = {
          id: response.user.id,
          login: response.user.login,
          token: response.token,
          pseudo: response.user.pseudo
        };

        AuthService.setLogin(loginData);

        return loginData;
      }
    } catch (error) {
      console.error('Erreur lors de l\'authentification Google:', error);
      throw error;
    }
  }
}

export default GoogleAuthService;