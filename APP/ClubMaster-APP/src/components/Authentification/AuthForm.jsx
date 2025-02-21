import React, { useState, useEffect, useCallback } from 'react';
import PersonalInfoForm from './PersonalInfoForm';
import FindClubOption from '../ClubOptions/FindClubOption';
import useStore from '../../store/store';
import api from '../../js/App/Api';
import { FacebookIcon } from 'lucide-react';

const passwordRules = [
  { message: "Une lettre minuscule.", regex: /[a-z]+/ },
  { message: "Une lettre majuscule.", regex: /[A-Z]+/ },
  { message: "8 caractères minimum.", regex: /.{8,}/ },
  { message: "Un chiffre minimum.", regex: /[0-9]+/ }
];

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  // const [login, setLogin] = useState('jules@clubmaster.bzh');
  // const [password, setPassword] = useState('Test1234');
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
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  const setItems = useStore((state) => state.setItems);
  const setShowApp = useStore((state) => state.setShowApp);

  const testimonials = [
    {
      text: "Gérez votre planning sportif en toute simplicité. Inscrivez-vous aux événements et suivez vos activités en temps réel.",
      author: "Planning Interactif",
      role: "Organisation simplifiée",
      image: "../../../public/carousel-auth-planning.webp"
    },
    {
      text: "Une interface intuitive accessible sur tous vos appareils. Restez connecté à votre club où que vous soyez.",
      author: "Multi-support",
      role: "Mobile, tablette, ordinateur",
      image: "../../../public/carousel-auth-multi-support.webp"
    },
    {
      text: "Communiquez facilement avec votre équipe et vos coachs. Messagerie intégrée et notifications en temps réel.",
      author: "Communication",
      role: "Restez connecté",
      image: "../../../public/carousel-auth-communication.webp"
    },
    {
      text: "Gérez votre profil, vos licences et vos informations personnelles. Tout est centralisé au même endroit.",
      author: "Profil Personnel",
      role: "Gestion simplifiée",
      image: "../../../public/carousel-auth-profil-personnel.webp"
    }
  ];

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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonialIndex((prevIndex) => 
        (prevIndex + 1) % testimonials.length
      );
    }, 5000); // Change de témoignage toutes les 5 secondes

    return () => clearInterval(timer);
  }, []);

  const fetchAdressCurrentUser = useCallback(async (personPhysicId) => {
    try {
      const dataCurrentUserAddresses = await api.get(`/address/personnel/${personPhysicId}`);
      setItems('currentUserAddresses', dataCurrentUserAddresses)
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
    }
  }, [setItems]);

  const fetchClub = useCallback(async (personPhysicId) => {
    try {
      const dataClub = await api.get(`/club/personnel/${personPhysicId}`);
      
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
  }, [setItems, setShowApp]);

  const fetchPersonPhysic = useCallback(async (userId) => {
    try {
      const dataPersonPhysic = await api.get('/personPhysic', { params: { loginId: userId } });

      if (dataPersonPhysic.length) {
        setItems('currentUser', dataPersonPhysic[0]);
        await fetchAdressCurrentUser(dataPersonPhysic[0].id);
        await fetchClub(dataPersonPhysic[0].id);
      } else {
        setShowPersonalInfo(true);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
    }
  }, [fetchAdressCurrentUser, fetchClub, setItems]);

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

      const data = await api.post(endpoint, body);
      
      localStorage.setItem('token', data.token);
      setItems('login', { id: data.user.id, login: data.user.login, pseudo: data.user.pseudo });
      setShowLoginForm(false);
      
      if (isLogin) {
        await fetchPersonPhysic(data.user.id);
      } else {
        setShowPersonalInfo(true);
      }
    } catch (err) {
      if (err.status === 401) {
        setError('Utilisateur ou mot de passe incorrect');
      } else if (err.status === 400) {
        setError('Ce nom d\'utilisateur existe déjà');
      }else {
        setError(`Erreur lors de ${isLogin ? 'la connexion' : 'la création du compte'}`);
      }
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

  const handlePersonalInformationSet = () => {
    setShowClubOptions(true);
    setShowPersonalInfo(false);
  }

  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-[1fr,1fr] lg:px-0">
      <div className="relative hidden h-full flex-col bg-zinc-900 p-10 text-white lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <img src="../../../public/logo_ClubMaster.jpg" alt="ClubMaster" className="h-10 w-10 mr-2 rounded" />
          ClubMaster
        </div>
        <div className="relative z-20 flex-1 flex items-center justify-center">
          <div className="space-y-4">
            <div className="flex flex-col items-center space-y-6">
              <div className="w-full overflow-hidden rounded-lg mb-8">
                <img 
                  src={testimonials[currentTestimonialIndex].image}
                  alt={testimonials[currentTestimonialIndex].author}
                  className="w-[1000px] h-[600px] object-cover transition-opacity duration-300"
                />
              </div>
              
              <blockquote className="space-y-2 transition-opacity duration-300 text-center mt-8">
                <p className="text-lg">
                  "{testimonials[currentTestimonialIndex].text}"
                </p>
                <footer className="text-sm">
                  <p className="font-semibold">{testimonials[currentTestimonialIndex].author}</p>
                  <p className="text-zinc-400">{testimonials[currentTestimonialIndex].role}</p>
                </footer>
              </blockquote>
            </div>
            
            <div className="flex justify-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonialIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentTestimonialIndex === index ? 'bg-white' : 'bg-zinc-600'
                  }`}
                  aria-label={`Témoignage ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}
          
          {showLoginForm && (
            <div className="flex flex-col space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                {isLogin ? 'Connexion' : 'Créer un compte'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isLogin ? 'Connectez-vous à votre compte' : 'Créez votre compte pour commencer'}
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <input
                    type="email"
                    placeholder="Email"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400"
                    required
                  />
                  
                  <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400"
                    required
                  />
                  
                  {!isLogin && (
                    <>
                      <input
                        type="password"
                        placeholder="Confirmer le mot de passe"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400"
                        required
                      />
                      
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
                className="w-full py-2 border rounded-md flex items-center justify-center gap-2 hover:bg-zinc-50"
              >
                <span className="font-bold">G</span>
                Google
              </button>
              <button
                type="button"
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
          )}

          {showPersonalInfo && (
            <PersonalInfoForm handlePersonalInformationSet={handlePersonalInformationSet} />
          )}

        </div>
        {showClubOptions && (
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 ml-20">
            <FindClubOption />
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthForm;