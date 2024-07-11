import axios from "axios";

export class APIController {
  constructor(options = {}) {
    this.axios = axios.create({
      baseURL: options.baseURL || '',
      timeout: options.timeout || 10000,
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
    // Vous pouvez personnaliser la gestion des erreurs ici
    if (error.response) {
      // La requête a été faite et le serveur a répondu avec un code d'état
      // qui ne fait pas partie de la plage 2xx
      console.error('Response error:', error.response.data);
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
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