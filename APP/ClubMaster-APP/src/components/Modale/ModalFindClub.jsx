import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Select from 'react-select';
import { toSqlDate, getDateEndLicence } from '../../js/date';
import useStore from '../../store/store';
import api from '../../js/App/Api';
import { Search, MapPin, X } from 'lucide-react';

const ClubCard = React.memo(({ club, onClick }) => (
  <div 
    onClick={() => onClick(club)}
    className="group relative flex cursor-pointer items-center justify-between rounded-lg border p-4 hover:bg-gray-50 transition-colors"
  >
    <h3 className="text-sm font-medium leading-none">{club.label}</h3>
    <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
      <span className="text-xs text-muted-foreground">Cliquer pour rejoindre</span>
    </div>
  </div>
));

const ModalFindClub = ({ isOpen, onClose }) => {
  const [error, setError] = useState(null);
  const [nomClub, setNomClub] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const clubsPerPage = 10;

  const { userClubs, clubs, addresses, setItems, addItem, addItems, currentUser } = useStore((state) => ({
    userClubs : state.userClubs || [],
    clubs: state.clubs || [],
    addresses: state.addresses || [],
    setItems: state.setItems,
    addItem: state.addItem,
    addItems : state.addItems,
    currentUser: state.currentUser,
    setShowApp: state.setShowApp
  }));

  const fetchData = useCallback(async (endpoint) => {
    try {
      return await api.get(endpoint);
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
      return [];
    }
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      const [clubsData] = await Promise.all([
        fetchData('club'),
      ]);
      setItems('clubs', clubsData);
    };
    
    fetchAllData();
  }, [fetchData, setItems]);

  const filteredClubs = useMemo(() => {
    return clubs.filter((club) => {
      const isNameMatch = club.label.toLowerCase().includes(nomClub.toLowerCase());
      const isNotUserClub = !userClubs.some(userClub => userClub.id === club.id);
      
      if (!selectedLocation || selectedLocation.value === 'all') return isNameMatch && isNotUserClub;
      
      const clubAddress = addresses.find(add => add.referenceid === club.id);
      const isLocationMatch = clubAddress && 
        clubAddress.postalcode === selectedLocation.postalcode && 
        clubAddress.city === selectedLocation.city;
      
      return isNameMatch && isLocationMatch && isNotUserClub;
    });
  }, [clubs, addresses, nomClub, selectedLocation, userClubs]);

  const handleClick = useCallback(async (club) => {
    try {
      const fetchData = async (url, method, body = null) => {
        if (method === 'GET') {
          return await api.get(url);
        } else if (method === 'POST') {
          return await api.post(url, body);
        }
      };

      const roleData = await api.get("/role", { params: { arrayClubId: JSON.stringify([club.id])} });
      const roleId = roleData.find(role => role.clubid === club.id && role.level === 0)?.id;
      addItems('roles', roleData);
      if (roleId === undefined) {
        console.error(`Aucun rôle trouvé pour le club ${club.id} avec le niveau 0`);
      }

      const typeLicencesData = await api.get("/licenceType", { params: { arrayClubId: JSON.stringify([club.id])} });
      const licenceTypeId = typeLicencesData.find(licTyp => licTyp.clubid === club.id && licTyp.basic === true)?.id;
      addItems('licenceTypes', typeLicencesData);
      if (licenceTypeId === undefined) {
        console.error(`Aucun type de licence trouvé pour le club ${club.id} avec le nom Licence Visiteur`);
      }

      const licenceData = await fetchData('/licence', 'POST', {
        label: "Licence Visiteur",
        dd: toSqlDate(new Date()),
        df: toSqlDate(getDateEndLicence()),
        licenceTypeId: licenceTypeId,
        personPhysicId: currentUser.id,
        roleId: roleId,
      });

      addItem('licences', licenceData);

      const createdClubNotif = {
        label: `Club rejoint avec succès !! Vous êtes désormais visiteur de ${club.label}`,
        time: new Date()
      };
      addItem('notifications', createdClubNotif);
      addItem('userClubs', club);

      // Mettez à jour le temps de la dernière récupération
      useStore.setState({ lastFetchTime: null });

      onClose();
    } catch (err) {
      console.error('Erreur lors de la création du club:', err.message);
      setError(err.message);
    }
  }, [addItem, addItems, currentUser, onClose]);

  const locations = useMemo(() => {
    if (!addresses || addresses.length === 0) return [];
  
    const uniqueLocations = new Map();
  
    addresses
      .filter(add => add && add.postalcode && add.city)
      .forEach(add => {
        const key = `${add.postalcode}:${add.city}`;
        if (!uniqueLocations.has(key)) {
          uniqueLocations.set(key, {
            value: add.id,
            label: `${add.postalcode} : ${add.city}`,
            postalcode: add.postalcode,
            city: add.city
          });
        }
      });
  
    const sortedLocations = Array.from(uniqueLocations.values())
      .sort((a, b) => a.label.localeCompare(b.label));

    return [
      { value: 'all', label: 'Toutes les locations' },
      ...sortedLocations
    ];
  
  }, [addresses]);

  if (!isOpen) return null;

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Erreur</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const indexOfLastClub = currentPage * clubsPerPage;
  const indexOfFirstClub = indexOfLastClub - clubsPerPage;
  const currentClubs = filteredClubs.slice(indexOfFirstClub, indexOfLastClub);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Trouver un Club</h2>
            <button 
              onClick={onClose}
              className="rounded-full p-1.5 hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  <Search className="h-4 w-4 inline mr-2" />
                  Nom
                </label>
                <input
                  type="text"
                  placeholder="Nom du club"
                  value={nomClub}
                  onChange={(e) => setNomClub(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  <MapPin className="h-4 w-4 inline mr-2" />
                  Lieu
                </label>
                <Select
                  options={locations}
                  onChange={setSelectedLocation}
                  placeholder="Sélectionner un lieu"
                  value={selectedLocation}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>
            </div>
          </div>

          <div className="border rounded-lg">
            <div className="max-h-[400px] overflow-y-auto p-4 space-y-2">
              {currentClubs.length > 0 ? (
                currentClubs.map((club) => (
                  <ClubCard key={club.id} club={club} onClick={handleClick} />
                ))
              ) : (
                <div className="text-center space-y-4 py-8">
                  <p className="text-gray-500">
                    Aucun club ne correspond à ces critères.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-700">
                      Si vous ne trouvez pas votre club dans la liste, 
                      <a 
                        href="mailto:contact@clubmaster.fr" 
                        className="font-medium underline hover:text-blue-800 ml-1"
                      >
                        contactez-nous
                      </a>
                      . Nous serons ravis d'accompagner votre club dans sa digitalisation !
                    </p>
                    <p className="text-sm text-blue-700 mt-2">
                      <span className="font-medium">Avantage :</span> En intégrant tous vos clubs sur ClubMaster, vous bénéficiez d'une gestion centralisée de toutes vos activités sportives sur une seule application.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center mt-4 gap-1">
            {Array.from({ length: Math.ceil(filteredClubs.length / clubsPerPage) }, (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  currentPage === i + 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalFindClub;