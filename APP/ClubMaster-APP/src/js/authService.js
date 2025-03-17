class AuthService {
    static isStorageAvailable() {
        try {
            // Vérifier si window existe (pour éviter les erreurs SSR)
            if (typeof window === 'undefined') return false;
            
            // Vérifier si localStorage existe
            if (!window.localStorage) return false;
            
            // Test d'écriture/lecture
            const testKey = '__storage_test__';
            window.localStorage.setItem(testKey, testKey);
            window.localStorage.removeItem(testKey);
            return true;
        } catch(e) {
            console.warn('Erreur d\'accès au localStorage:', e);
            return false;
        }
    }

    static isAuthenticated() {
      if (!this.isStorageAvailable()) return false;
      try {
        const login = localStorage.getItem('login');
        if (!login) return false;
        const loginData = JSON.parse(login);
        return !!loginData && !!loginData.id;
      } catch (e) {
        console.error('Erreur lors de la vérification de l\'authentification:', e);
        return false;
      }
    }

    static isPersonalInfoSet() {
      if (!this.isStorageAvailable()) return false;
      try {
        const login = localStorage.getItem('login');
        const loginData = JSON.parse(login);
        if (loginData.firstname && loginData.lastname && loginData.naissancedate && loginData.phonenumber) {
          return true;
        } else {
          return false;
        }
      } catch (e) {
        console.error('Erreur lors de la récupération du login:', e);
        return false;
      }
    }
  
    static getLogin() {
      if (!this.isStorageAvailable()) return null;
      try {
        const login = localStorage.getItem('login');
        return login ? JSON.parse(login) : null;
      } catch (e) {
        console.error('Erreur lors de la récupération du login:', e);
        return null;
      }
    }
  
    static setLogin(login) {
      if (!this.isStorageAvailable()) return false;
      try {
        localStorage.setItem('login', JSON.stringify(login));
        return true;
      } catch (e) {
        console.error('Erreur lors de la sauvegarde du login:', e);
        return false;
      }
    }
  
    static clearLogin() {
      if (!this.isStorageAvailable()) return;
      localStorage.removeItem('login');
    }

    static isUserClubsSet() {
      if (!this.isStorageAvailable()) return false;
      const userClubs = localStorage.getItem('userClubs');
      return !!userClubs;
    }

    static getUserClubs() {
      if (!this.isStorageAvailable()) return null;
      try {
        const userClubs = localStorage.getItem('userClubs');
        return userClubs ? JSON.parse(userClubs) : null;
      } catch (e) {
        console.error('Erreur lors de la récupération des clubs:', e);
        return null;
      }
    }
  
    static setUserClubs(userClubs) {
      if (!this.isStorageAvailable()) return false;
      try {
        localStorage.setItem('userClubs', JSON.stringify(userClubs));
        return true;
      } catch (e) {
        console.error('Erreur lors de la sauvegarde des clubs:', e);
        return false;
      }
    }
  
    static clearUserClubs() {
      if (!this.isStorageAvailable()) return;
      localStorage.removeItem('userClubs');
    }
  
    static logout() {
      this.clearLogin();
      this.clearUserClubs();
    }
  }
  
  export default AuthService;