// api.js
import { APIController } from './APIController';

const api = new APIController({
  baseURL: 'http://localhost:3200/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Ajout d'un intercepteur pour l'authentification
api.addRequestInterceptor(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

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