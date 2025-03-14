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
        AuthService.logout();
        window.location.href = '/auth/login';
      }

      // Vérification du token expiré ou invalide
      if (error.response.status === 403 && 
          (error.response.data.error === 'Invalid token' || 
           error.response.data.details === 'jwt expired')) {
        // Supprimer le token invalide du localStorage
        localStorage.removeItem('token');
        
        // Utiliser la fonction de navigation
        const navigate = getNavigate();
        if (navigate) {
          navigate('/auth/login');
        } else {
          // Fallback si navigate n'est pas disponible
          window.location.href = '/auth/login';
        }
        return;
      }
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      console.error('Request error:', error.request);
    } else {
      // Quelque chose s'est passé lors de la configuration de la requête qui a déclenché une erreur
      console.error('Error:', error.message);
    }
    return error;
  }
}