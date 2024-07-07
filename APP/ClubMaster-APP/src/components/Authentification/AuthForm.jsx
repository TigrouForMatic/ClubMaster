import React, { useState, useEffect } from 'react';
import styles from '../../styles/AuthForm.module.css';
import PersonalInfoForm from './PersonnalInfoForm';

function AuthForm({ onAuthenticate }) {
  const [isLogin, setIsLogin] = useState(true);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordValidation, setPasswordValidation] = useState({
    valid: false,
    errors: []
  });
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);

  const rules = [
    { message: "Une lettre minuscule.", regex: /[a-z]+/, successId: false },
    { message: "Une lettre majuscule.", regex: /[A-Z]+/, successId: false },
    { message: "8 caractères minimum.", regex: /.{8,}/, successId: false },
    { message: "Un chiffre minimum.", regex: /[0-9]+/, successId: false }
  ];

  useEffect(() => {
    validatePassword(password);
  }, [password]);

  const validatePassword = (newPassword) => {
    let errors = rules.map(condition => {
      const isValid = condition.regex.test(newPassword);
      return { ...condition, successId: isValid };
    });

    setPasswordValidation({
      valid: errors.every(error => error.successId),
      errors: errors
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        // Code de connexion inchangé
        const response = await fetch('http://localhost:3200/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ login, password }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log('Connexion réussie:', data);
          localStorage.setItem('token', data.token);
          onAuthenticate();
        } else {
          setError(data.message || 'Erreur lors de la connexion');
        }
      } else {
        if (password !== confirmPassword) {
          setError("Les mots de passe ne correspondent pas");
          return;
        }

        const response = await fetch('http://localhost:3200/api/auth/create-account', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ login, password }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log('Compte créé avec succès:', data);
          localStorage.setItem('token', data.token);
          localStorage.setItem('login', JSON.stringify({ id: data.id, login : data.login, pseudo : data.pseudo, token : data.token }));
          setShowPersonalInfo(true);
        } else {
          setError(data.message || 'Erreur lors de la création du compte');
        }
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
    console.log('Continuer sans être connecté');
    onAuthenticate();
  };

  return (
    <div className={styles.authContainer}>
      {error && <p className={styles.error}>{error}</p>}
      {!showPersonalInfo ? (
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
      ) : (
        <>
          <PersonalInfoForm onAuthenticate={onAuthenticate} />
        </>
      )}
      {!showPersonalInfo && (
        <>
          <button onClick={toggleForm} className={styles.toggleButton}>
            {isLogin ? 'Créer un compte' : 'Se connecter'}
          </button>
          <button onClick={continueWithoutLogin} className={styles.skipButton}>
            Continuer sans être connecté
          </button>
        </>
      )}
    </div>
  );
}

export default AuthForm;