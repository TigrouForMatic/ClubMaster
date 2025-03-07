import React, { useState, useEffect, useCallback } from 'react';
import useStore from '../../store/store';
import api from '../../js/App/Api';
import { FacebookIcon, Eye, EyeOff } from 'lucide-react';
import GoogleAuthService from '../../js/googleAuth';
import { useNavigate } from 'react-router-dom';
import AuthCarousel from './AuthCarousel';
import AuthService from '../../js/authService';

const passwordRules = [
  { message: "Une lettre minuscule.", regex: /[a-z]+/ },
  { message: "Une lettre majuscule.", regex: /[A-Z]+/ },
  { message: "8 caractères minimum.", regex: /.{8,}/ },
  { message: "Un chiffre minimum.", regex: /[0-9]+/ }
];

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [login, setLogin] = useState('elisa@clubmaster.bzh');
  const [password, setPassword] = useState('Test1234');
  // const [login, setLogin] = useState('');
  // const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    valid: false,
    errors: []
  });
  const navigate = useNavigate();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await api.post(isLogin ? '/auth/login' : '/auth/create-account', {
        login,
        password
      });

      if (response.token) {
        const loginData = {
          id: response.user.id,
          login: response.user.login,
          token: response.token,
          pseudo: response.user.pseudo
        }

        AuthService.setLogin(loginData);
        
        // Mettre à jour le login
        useStore.setState({
          login: loginData,
          lastFetchTime: null
        });

        // Récupérer les données de l'utilisateur
        const dataPersonPhysic = await api.get('/personPhysic', { 
          params: { loginId: response.user.id } 
        });

        if (dataPersonPhysic.length) {
          // Mettre à jour l'utilisateur
          useStore.setState({
            currentUser: dataPersonPhysic[0]
          });

          AuthService.setUserData(dataPersonPhysic[0]);

          // Récupérer l'adresse
          const dataCurrentUserAddresses = await api.get(`/address/personnel/${dataPersonPhysic[0].id}`);
          useStore.setState({
            currentUserAddresses: dataCurrentUserAddresses
          });

          // Récupérer les clubs
          const dataClub = await api.get(`/club/personnel/${dataPersonPhysic[0].id}`);
          if (dataClub.length) {
            useStore.setState({
              userClubs: dataClub
            });
            AuthService.setUserClubs(dataClub);
            navigate('/');
          } else {
            navigate('/auth/find-club');
          }
        } else {
          navigate('/auth/personal-info');
        }
      }
    } catch (err) {
      if (err.status === 401) {
        setError('Login ou mot de passe incorrect');
      } else if (err.status === 400) {
        setError('Ce nom d\'utilisateur existe déjà');
      } else {
        setError(`Erreur lors de ${isLogin ? 'la connexion' : 'la création du compte'}`);
      }
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setLogin('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setError('');
  };

  const handleGoogleLogin = async () => {
    try {
      await GoogleAuthService.handleGoogleLogin();
    } catch (error) {
      setError('Erreur lors de la connexion avec Google');
    }
  };

  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-[1fr,1fr] lg:px-0 sm:mx-0">
      <AuthCarousel />
      
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] px-4 sm:px-0">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}
          
          <div className="flex flex-col space-y-2 w-full">
            <h1 className="text-2xl font-semibold tracking-tight">
              {isLogin ? 'Connexion' : 'Créer un compte'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isLogin ? 'Connectez-vous à votre compte' : 'Créez votre compte pour commencer'}
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              <div className="space-y-2 w-full">
                <input
                  type="email"
                  placeholder="Email"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400"
                  required
                />
                
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                
                {!isLogin && (
                  <>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirmer le mot de passe"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    
                    <div className="bg-zinc-50 p-4 rounded-lg space-y-2">
                      {passwordValidation.errors.map((error, index) => (
                        <div 
                          key={index}
                          className={`text-sm flex items-center space-x-2 ${
                            error.successId ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          <span>{error.successId ? '✓' : '✗'}</span>
                          <span>{error.message}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <button
                type="submit"
                disabled={!isLogin && !passwordValidation.valid}
                className="w-full py-2 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLogin ? 'Se connecter' : 'Créer un compte'}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">
                  Ou continuer avec
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-2 border rounded-md flex items-center justify-center gap-2 hover:bg-zinc-50"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>Continuer avec Google</span>
            </button>
            <button
              type="button"
              onClick={() => {
                window.alert('Cette fonctionnalité n\'est pas encore disponible. Elle arrivera dans une prochaine version.');
              }}
              className="w-full py-2 border rounded-md flex items-center justify-center gap-2 hover:bg-zinc-50"
            >
              <FacebookIcon className="h-4 w-4" />
              Facebook
            </button>

            <button
              onClick={toggleForm}
              className="w-full text-sm text-zinc-600 hover:text-zinc-900"
            >
              {isLogin ? 'Créer un compte' : 'Se connecter'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;