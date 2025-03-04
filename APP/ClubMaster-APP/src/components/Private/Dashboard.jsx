import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Settings } from 'iconoir-react';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleCreateClub = () => {
    navigate('/create-club');
  };

  const handleManageClubs = () => {
    navigate('/manage-clubs');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold tracking-tight mb-8">
        Tableau de bord administrateur
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Carte Créer un nouveau club */}
        <div 
          onClick={handleCreateClub}
          className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Plus className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold tracking-tight">
                Créer un nouveau club
              </h2>
            </div>
            <p className="text-muted-foreground">
              Ajoutez un nouveau club à votre plateforme
            </p>
          </div>
        </div>

        {/* Carte Gérer les clubs */}
        <div 
          onClick={handleManageClubs}
          className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold tracking-tight">
                Gérer les clubs
              </h2>
            </div>
            <p className="text-muted-foreground">
              Consultez et modifiez les informations des clubs existants
            </p>
          </div>
        </div>

        {/* Carte Paramètres */}
        <div 
          onClick={handleSettings}
          className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold tracking-tight">
                Paramètres
              </h2>
            </div>
            <p className="text-muted-foreground">
              Configurez les paramètres de votre compte et de la plateforme
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 