class AuthService {
    static #initialized = false;

    static isInitialized() {
        if (!this.isStorageAvailable()) return false;
        if (!this.#initialized) {
            try {
                // Vérifie si on peut accéder au localStorage et si les structures nécessaires existent
                const login = localStorage.getItem('login');
                const userData = localStorage.getItem('userData');
                const userClubs = localStorage.getItem('userClubs');
                
                // Marque le service comme initialisé si on peut accéder au stockage
                this.#initialized = true;
                return true;
            } catch (e) {
                console.error('Erreur lors de l\'initialisation du service d\'authentification:', e);
                return false;
            }
        }
        return true;
    }

    static isStorageAvailable() {
      try {
        const storage = window.localStorage;
        const x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
      } catch(e) {
        return false;
      }
    }

    static isAuthenticated() {
      if (!this.isStorageAvailable()) return false;
      const login = localStorage.getItem('login');
      return !!login;
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

    static isPersonalInfoSet() {
      if (!this.isStorageAvailable()) return false;
      const personalInfo = localStorage.getItem('personalInfo');
      return !!personalInfo;
    }
  
    static getUserData() {
      if (!this.isStorageAvailable()) return null;
      try {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
      } catch (e) {
        console.error('Erreur lors de la récupération des données utilisateur:', e);
        return null;
      }
    }
  
    static setUserData(userData) {
      if (!this.isStorageAvailable()) return false;
      try {
        localStorage.setItem('userData', JSON.stringify(userData));
        return true;
      } catch (e) {
        console.error('Erreur lors de la sauvegarde des données utilisateur:', e);
        return false;
      }
    }
  
    static clearUserData() {
      if (!this.isStorageAvailable()) return;
      localStorage.removeItem('userData');
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
      this.clearUserData();
      this.clearUserClubs();
    }

    static initialize() {
        if (!this.isStorageAvailable()) {
            throw new Error('Le stockage local n\'est pas disponible');
        }
        this.#initialized = true;
    }
  }
  
  export default AuthService;