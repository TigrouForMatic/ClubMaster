import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthCarousel from './AuthCarousel';
import FindClubOption from '../ClubOptions/FindClubOption';

const AuthFindClubOption = () => {
  const navigate = useNavigate();
  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-[1fr,1fr] lg:px-0 sm:mx-0">
        <AuthCarousel />
      
        <button
            onClick={() => {
            navigate('/auth/login');
            }}
            className="absolute top-4 left-[53%] text-zinc-600 hover:text-zinc-900"
        >
            ← Retour
        </button>
        
        <div className="lg:p-8">
            <FindClubOption />
        </div>
    </div>
  );
};

export default AuthFindClubOption;
