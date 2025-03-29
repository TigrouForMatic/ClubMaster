import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthCarousel from './AuthCarousel';
import FindClubOption from '../ClubOptions/FindClubOption';
import AuthService from '../../js/authService';

const AuthFindClubOption = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      navigate('/auth/login');
    } else if (!AuthService.isPersonalInfoSet()) {
      navigate('/auth/personal-info');
    } else if (AuthService.isUserClubsSet()) {
      navigate('/');
    }
  }, [navigate]);

  const handleReturnToLogin = () => {
    AuthService.logout();
    navigate('/auth/login');
  };

  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-[1fr,1fr] lg:px-0 sm:mx-0">
        <button
        onClick={handleReturnToLogin}
        className="absolute top-4 right-4 px-4 py-2 text-sm bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-md transition-colors"
        >
          Retour à la connexion
        </button>

        <AuthCarousel />
            
        <div className="lg:p-8">
            <FindClubOption />
        </div>
    </div>
  );
};

export default AuthFindClubOption;
