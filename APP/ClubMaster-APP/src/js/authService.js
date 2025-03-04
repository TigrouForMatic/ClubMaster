class AuthService {
    static isAuthenticated() {
      const token = localStorage.getItem('token');
      return !!token;
    }
  
    static getToken() {
      return localStorage.getItem('token');
    }
  
    static setToken(token) {
      localStorage.setItem('token', token);
    }
  
    static clearToken() {
      localStorage.removeItem('token');
    }
  
    static getUserData() {
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    }
  
    static setUserData(userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  
    static clearUserData() {
      localStorage.removeItem('userData');
    }
  
    static logout() {
      this.clearToken();
      this.clearUserData();
    }
  }
  
  export default AuthService;