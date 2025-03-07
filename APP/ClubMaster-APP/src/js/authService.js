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

    static isPersonalInfoSet() {
      const personalInfo = localStorage.getItem('personalInfo');
      return !!personalInfo;
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

    static isUserClubsSet() {
      const userClubs = localStorage.getItem('userClubs');
      return !!userClubs;
    }

    static getUserClubs() {
      const userClubs = localStorage.getItem('userClubs');
      return userClubs ? JSON.parse(userClubs) : null;
    }
  
    static setUserClubs(userClubs) {
      localStorage.setItem('userClubs', JSON.stringify(userClubs));
    }
  
    static clearUserClubs() {
      localStorage.removeItem('userClubs');
    }
  
    static logout() {
      this.clearToken();
      this.clearUserData();
      this.clearUserClubs();
    }
  }
  
  export default AuthService;