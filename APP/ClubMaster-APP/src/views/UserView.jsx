import React, { useMemo, useState } from "react";
import { useNavigate } from 'react-router-dom';
import api from '../js/App/Api';
import useStore from '../store/store';
import { SystemShut, Plus } from 'iconoir-react';
import AuthService from '../js/authService';
import UserImage from '../components/UserImage';
import LicenceList from '../components/User/LicenceList';
import BadgeSection from '../components/User/BadgeSection';
import MenuSection from '../components/User/MenuSection';
import ModalFindClub from "../components/Modale/ModalFindClub";
import ChatbotModale from "../components/User/ChatbotModale";
import { Progress } from "../components/ui/progress";

function UserView() {
  const navigate = useNavigate();
  const { currentUser, currentUserAddresses, userClubs, licences, licenceTypes, roles, setItems, setShowApp, setLastFetchTime } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const user = useMemo(() => {
    if (!currentUserAddresses || currentUserAddresses.length === 0) {
      return {
        ...currentUser,
        address: 'Aucune Adresse'
      };
    }
    const { postalcode = '', city = '' } = currentUserAddresses[0] || {};
    const addressLabel = postalcode && city ? `${postalcode} ${city}` : 'Aucune Adresse';
    return {
      ...currentUser,
      address: addressLabel
    };
  }, [currentUserAddresses, currentUser]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setItems('currentUser', null);
    setItems('login', null);
    setLastFetchTime(null);
    navigate('/auth/login');
    AuthService.logout();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl pb-24">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center space-x-4">
          <UserImage name={user.name} className="w-16 h-16 rounded-full" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-500">{user.address}</p>
          </div>
        </div>

        {/* Level Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Mon Niveau</h2>
            <span className="text-blue-600 font-medium">
              {currentUser.points} CMP disponibles
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Niveau {currentUser.level}</span>
              <span>251 CMP pour niveau suivant</span>
            </div>
            <Progress 
              className="h-2 w-full"
              value={(currentUser.points / 1000) * 100} 
            />
          </div>
        </div>

        {/* Licences Section */}
        <LicenceList />

        {/* Badges Section */}
        <BadgeSection />

        {/* Join Club Button */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Rejoindre un nouveau club</span>
        </button>

        {/* Menu Section */}
        <MenuSection />

        {/* Training Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Entrainement et Diététique
          </h2>
        </div>

        {/* Chatbot Button */}
        <button 
          onClick={() => setIsChatbotOpen(true)}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors"
        >
          CHATBOT & SERVICE
        </button>

        {/* Rewards Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Mes Cartes et Réductions
          </h2>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
        >
          <SystemShut className="w-5 h-5" />
          <span>Déconnexion</span>
        </button>

        {/* Modals */}
        <ModalFindClub isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <ChatbotModale isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
      </div>
    </div>
  );
}

export default UserView;