// api.js
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

// api.axios.interceptors.response.use(
//   response => {
//     console.log('Réponse reçue:', {
//       status: response.status,
//       headers: response.headers,
//       data: response.data
//     });
//     return response;
//   },
//   error => {
//     console.error('Erreur de réponse:', {
//       message: error.message,
//       status: error?.response?.status,
//       data: error?.response?.data
//     });
//     return Promise.reject(error);
//   }
// );

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