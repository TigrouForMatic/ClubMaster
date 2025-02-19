// api.js
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

// Ajout d'un intercepteur pour l'authentification
api.addRequestInterceptor(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
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