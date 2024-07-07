import React, { useState } from 'react';
import styles from '../styles/AuthForm.module.css';

function AuthForm({ onAuthenticate }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      console.log('Tentative de connexion avec:', email, password);
      // Simulons une connexion réussie
      // Dans une vraie application, vous devriez vérifier les credentials côté serveur
      onAuthenticate();
    } else {
      if (password !== confirmPassword) {
        alert("Les mots de passe ne correspondent pas");
        return;
      }
      console.log('Tentative de création de compte avec:', email, password);
      // Simulons une création de compte réussie
      // Dans une vraie application, vous devriez envoyer ces informations au serveur
      onAuthenticate();
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const continueWithoutLogin = () => {
    console.log('Continuer sans être connecté');
    // Appeler onAuthenticate pour passer à l'application principale
    onAuthenticate();
  };

  return (
    <div className={styles.authContainer}>
      <form onSubmit={handleSubmit} className={styles.authForm}>
        <h2>{isLogin ? 'Connexion' : 'Création de compte'}</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        )}
        <button type="submit">
          {isLogin ? 'Se connecter' : 'Créer un compte'}
        </button>
      </form>
      <button onClick={toggleForm} className={styles.toggleButton}>
        {isLogin ? 'Créer un compte' : 'Se connecter'}
      </button>
      <button onClick={continueWithoutLogin} className={styles.skipButton}>
        Continuer sans être connecté
      </button>
    </div>
  );
}

export default AuthForm;