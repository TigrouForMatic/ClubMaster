import React, { useState, useEffect, useCallback } from 'react';
import styles from '../../styles/AuthForm.module.css';
import PersonalInfoForm from './PersonalInfoForm';
import ClubOptions from '../ClubOptions/ClubOptions';
import useStore from '../../store/store';

const API_BASE_URL = 'http://localhost:3200/api';

const passwordRules = [
  { message: "Une lettre minuscule.", regex: /[a-z]+/ },
  { message: "Une lettre majuscule.", regex: /[A-Z]+/ },
  { message: "8 caractères minimum.", regex: /.{8,}/ },
  { message: "Un chiffre minimum.", regex: /[0-9]+/ }
];

function AuthForm({ }) {
  const [isLogin, setIsLogin] = useState(true);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordValidation, setPasswordValidation] = useState({
    valid: false,
    errors: []
  });
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [showClubOptions, setShowClubOptions] = useState(false);

  const setItems = useStore((state) => state.setItems);
  const setShowApp = useStore((state) => state.setShowApp);

  const validatePassword = useCallback((newPassword) => {
    const errors = passwordRules.map(condition => ({
      ...condition,
      successId: condition.regex.test(newPassword)
    }));

    setPasswordValidation({
      valid: errors.every(error => error.successId),
      errors
    });
  }, []);

  useEffect(() => {
    validatePassword(password);
  }, [password, validatePassword]);

  const fetchClub = useCallback(async (personPhysicId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/club/personnel/${personPhysicId}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Erreur lors de la récupération des données du club');

      const dataClub = await response.json();

      if (dataClub.length) {
        setItems('userClubs', dataClub);

        setShowApp();
      } else {
        setShowClubOptions(true);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
    }
  }, []);

  const fetchPersonPhysic = useCallback(async (userId) => {
    try {
      const url = new URL(`${API_BASE_URL}/personPhysic`);
      url.searchParams.append('loginId', userId);

      const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Erreur lors de la récupération des données personnelles');

      const dataPersonPhysic = await response.json();

      if (dataPersonPhysic.length) {
        setItems('currentUser',dataPersonPhysic[0]);
        await fetchClub(dataPersonPhysic[0].id);
      } else {
        setShowPersonalInfo(true);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
    }
  }, [fetchClub]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = isLogin ? 'auth/login' : 'auth/create-account';
      const body = isLogin ? { login, password } : { login, password, confirmPassword };

      if (!isLogin && password !== confirmPassword) {
        setError("Les mots de passe ne correspondent pas");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setItems('login',{ id: data.user.id, login: data.user.login, pseudo: data.user.pseudo });
        setShowLoginForm(false);
        
        if (isLogin) {
          await fetchPersonPhysic(data.user.id);
        } else {
          setShowPersonalInfo(true);
        }
        
      } else {
        setError(data.message || `Erreur lors de ${isLogin ? 'la connexion' : 'la création du compte'}`);
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setLogin('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setShowPersonalInfo(false);
  };

  const continueWithoutLogin = () => {
    if (window.confirm("Êtes-vous sûr de vouloir continuer sans être connecté ? La majorité des fonctionnalités de l'application requièrent une connexion.")) {
      setShowApp();
    }
  };

  const handlePersonalInformationSet = () => {
    setShowClubOptions(true);
    setShowPersonalInfo(false);
  }

  return (
    <div className={styles.authContainer}>
      {error && <p className={styles.error}>{error}</p>}
      {showLoginForm && (
        <form onSubmit={handleSubmit} className={styles.authForm}>
          <h2>{isLogin ? 'Connexion' : 'Création de compte'}</h2>
            <input
              type="email"
              placeholder="Email"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {!isLogin && (
              <>
                <input
                  type="password"
                  placeholder="Confirmer le mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <div className={styles.passwordValidationCard}>
                  {passwordValidation.errors.map((error, index) => (
                    <div 
                      key={index} 
                      className={`${styles.validationRule} ${error.successId ? styles.validRule : styles.invalidRule}`}
                    >
                      {error.successId ? '✓' : '✗'} {error.message}
                    </div>
                  ))}
                </div>
              </>
            )}
            <button type="submit" disabled={!isLogin && !passwordValidation.valid}>
              {isLogin ? 'Se connecter' : 'Créer un compte'}
            </button>
        </form>
      )}
      {showPersonalInfo && (
        <PersonalInfoForm  
          handlePersonalInformationSet={handlePersonalInformationSet} 
        />
      )}
      {showLoginForm && (
        <>
          <button onClick={toggleForm} className={styles.toggleButton}>
            {isLogin ? 'Créer un compte' : 'Se connecter'}
          </button>
          <button onClick={continueWithoutLogin} className={styles.skipButton}>
            Continuer sans être connecté
          </button>
        </>
      )}
      {showClubOptions && <ClubOptions />}
    </div>
  );
}

export default AuthForm;