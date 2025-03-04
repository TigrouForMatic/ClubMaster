// api.js
import axios from 'axios';
import AuthService from '../authService';
import { APIController } from './ApiController';

const api = new APIController({
  baseURL: '/api',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: true
});

api.interceptors.request.use(
  (config) => {
    const token = AuthService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      AuthService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Ajoutez un intercepteur pour logger les requêtes
// api.axios.interceptors.request.use(request => {
//   console.log('Requête sortante:', {
//     url: request.url,
//     method: request.method,
//     headers: request.headers,
//     data: request.data
//   });
//   return request;
// });

export default api;

// // Dans vos composants ou hooks React
// import api from './api';

// // Exemple d'utilisation
// const fetchData = async () => {
//   try {
//     const data = await api.get('/users');
//     // Traiter les données
//   } catch (error) {
//     // Gérer l'erreur
//   }
// };