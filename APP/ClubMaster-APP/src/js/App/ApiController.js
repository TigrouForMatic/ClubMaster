//ApiController.js
import axios from "axios";
import AuthService from "../authService";
import { getNavigate } from '../navigationService';

export class APIController {
  constructor(options = {}) {
    this.axios = axios.create({
      baseURL: options.baseURL || '',
      timeout: options.timeout || 5000,
      headers: options.headers || {}
    });

    this.interceptors = {
      request: [],
      response: []
    };

    this.setupInterceptors();
  }

  setupInterceptors() {
    this.axios.interceptors.request.use(
      config => {
        // Ajouter le token Bearer pour toutes les requêtes sauf les exceptions
        const noAuthRoutes = ['/auth/login', '/auth/create-account', '/health', '/auth/google/callback'];
        
        // Nettoyer l'URL pour la comparaison
        const cleanUrl = config.url?.replace(/^\//, '') || '';
        
        // Vérifier si l'URL correspond à une route d'authentification
        const isAuthRoute = noAuthRoutes.some(route => {
            const cleanRoute = route.replace(/^\//, '');
            return cleanUrl === cleanRoute;
        });
        
        // Si c'est une route d'authentification, on ne fait rien
        if (isAuthRoute) {
            return config;
        }
        
        // Pour les autres routes, on ajoute le token si disponible
        const loginData = AuthService.getLogin();
        if (loginData?.token) {
            config.headers.Authorization = `Bearer ${loginData.token}`;
        }

        for (const interceptor of this.interceptors.request) {
          config = interceptor(config);
        }
        return config;
      },
      error => Promise.reject(error)
    );

    this.axios.interceptors.response.use(
      response => {
        for (const interceptor of this.interceptors.response) {
          response = interceptor(response);
        }
        return response;
      },
      error => Promise.reject(error)
    );
  }

  addRequestInterceptor(interceptor) {
    this.interceptors.request.push(interceptor);
  }

  addResponseInterceptor(interceptor) {
    this.interceptors.response.push(interceptor);
  }

  setBaseURL(url) {
    this.axios.defaults.baseURL = url;
  }

  setHeader(key, value) {
    this.axios.defaults.headers.common[key] = value;
  }

  removeHeader(key) {
    delete this.axios.defaults.headers.common[key];
  }

  async request(config) {
    try {
      const response = await this.axios(config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async get(url, config = {}) {
    return this.request({ ...config, method: 'get', url });
  }

  async post(url, data, config = {}) {
    return this.request({ ...config, method: 'post', url, data });
  }

  async put(url, data, config = {}) {
    return this.request({ ...config, method: 'put', url, data });
  }

  async patch(url, data, config = {}) {
    return this.request({ ...config, method: 'patch', url, data });
  }

  async delete(url, config = {}) {
    return this.request({ ...config, method: 'delete', url });
  }

  handleError(error) {
    if (error.response) {
      console.log('Response error:', error.response.data);
      console.log('Status:', error.response.status);
      console.log('Headers:', error.response.headers);

      if (error.response.status === 401) {
        // Vérifier si on a un refresh token valide
        const loginData = AuthService.getLogin();
        if (loginData?.refreshToken) {
          // Tenter un rafraîchissement du token
          this.axios.post('/auth/refresh-token', {
            refreshToken: loginData.refreshToken
          })
          .then(response => {
            if (response.data.token) {
              // Mettre à jour le token dans les données de login
              loginData.token = response.data.token;
              AuthService.setLogin(loginData);
              // Retenter la requête originale
              return this.axios(error.config);
            }
          })
          .catch(() => {
            // Si le rafraîchissement échoue, déconnecter l'utilisateur
            AuthService.logout();
            window.location.href = '/auth/login';
          });
        } else {
          AuthService.logout();
          window.location.href = '/auth/login';
        }
      }

      // Vérification du token expiré ou invalide
      if (error.response.status === 403 && 
          (error.response.data.error === 'Invalid token' || 
           error.response.data.details === 'jwt expired')) {
        // Tenter un rafraîchissement du token
        const loginData = AuthService.getLogin();
        if (loginData?.refreshToken) {
          this.axios.post('/auth/refresh-token', {
            refreshToken: loginData.refreshToken
          })
          .then(response => {
            if (response.data.token) {
              // Mettre à jour le token dans les données de login
              loginData.token = response.data.token;
              AuthService.setLogin(loginData);
              // Retenter la requête originale
              return this.axios(error.config);
            }
          })
          .catch(() => {
            AuthService.logout();
            const navigate = getNavigate();
            if (navigate) {
              navigate('/auth/login');
            } else {
              window.location.href = '/auth/login';
            }
          });
        } else {
          AuthService.logout();
          const navigate = getNavigate();
          if (navigate) {
            navigate('/auth/login');
          } else {
            window.location.href = '/auth/login';
          }
        }
        return;
      }
    } else if (error.request) {
      console.error('Request error:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return error;
  }
}