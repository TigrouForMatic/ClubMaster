import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Select from 'react-select';
import { toSqlDate, getDateEndLicence } from '../../js/date';
import useStore from '../../store/store';
import api from '../../js/App/Api';
import { Search, MapPin, Building2 } from 'lucide-react';


const ClubCard = React.memo(({ club, onClick }) => (
  <div 
    onClick={() => onClick(club)}
    className="group relative flex cursor-pointer items-center justify-between rounded-lg border p-4 hover:bg-gray-50 transition-colors"
  >
    <div className="flex items-center gap-3">
      <Building2 className="h-5 w-5 text-gray-400" />
      <h3 className="text-sm font-medium leading-none">{club.label}</h3>
    </div>
    {club.request && (
      <div className="ml-4">
        <span className="text-xs text-blue-500">Demande envoyée</span>
      </div>
    )}
    {!club.request && (
      <div className="ml-4 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
        <span className="text-xs text-muted-foreground">Cliquer pour rejoindre</span>
      </div>
    )}
  </div>
));

const FindClubOption = () => {
  const [error, setError] = useState(null);
  const [nomClub, setNomClub] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const clubsPerPage = 10;

  const { clubs, addresses, setItems, addItem, currentUser, requestToJoin } = useStore((state) => ({
    clubs: state.clubs || [],
    addresses: state.addresses || [],
    setItems: state.setItems,
    addItem: state.addItem,
    currentUser: state.currentUser,
    requestToJoin: state.requestToJoin
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
      const [clubsData, addressesData, requestToJoinData] = await Promise.all([
        fetchData('club'),
        fetchData('address'),
        fetchData('requestToJoin')
      ]);
      setItems('clubs', clubsData);
      setItems('addresses', addressesData);
      setItems('requestToJoin', requestToJoinData);
    };
    
    fetchAllData();
  }, [fetchData, setItems]);

  const filteredClubs = useMemo(() => {
    return clubs.filter((club) => {
      const isNameMatch = club.label.toLowerCase().includes(nomClub.toLowerCase());
      if (!selectedLocation || selectedLocation.value === 'all') return isNameMatch;
      
      const clubAddress = addresses.find(add => add.referenceid === club.id);
      const isLocationMatch = clubAddress && 
        clubAddress.postalcode === selectedLocation.postalcode && 
        clubAddress.city === selectedLocation.city;
      
      return isNameMatch && isLocationMatch;
    });
  }, [clubs, addresses, nomClub, selectedLocation]);

  const handleClick = useCallback(async (club) => {
    try {
      const requestToJoinData = await api.post("/requestToJoin", {
        clubid: club.id, 
        personphysicid: currentUser.id
      });
      console.log(requestToJoinData);
      addItem('requestToJoin', requestToJoinData);
    } catch (err) {
      console.error('Erreur lors de la récupération des demandes d\'adhésion:', err.message);
    }
    // try {
    //   const fetchData = async (url, method, body = null) => {
    //     if (method === 'GET') {
    //       return await api.get(url);
    //     } else if (method === 'POST') {
    //       return await api.post(url, body);
    //     }
    //   };

    //   const roleData = await api.get("/role", { params: { arrayClubId: JSON.stringify([club.id])} });
    //   const roleId = roleData.find(role => role.clubid === club.id && role.level === 0)?.id;
    //   setItems('roles', roleData);
    //   if (roleId === undefined) {
    //     console.error(`Aucun rôle trouvé pour le club ${club.id} avec le niveau 0`);
    //   }

    //   const typeLicencesData = await api.get("/licenceType", { params: { arrayClubId: JSON.stringify([club.id])} });
    //   const licenceTypeId = typeLicencesData.find(licTyp => licTyp.clubid === club.id && licTyp.label === "Licence Visiteur")?.id;
    //   setItems('licenceTypes', typeLicencesData);
    //   if (licenceTypeId === undefined) {
    //     console.error(`Aucun type de licence trouvé pour le club ${club.id} avec le nom Licence Visiteur`);
    //   }

    //   const licenceData = await fetchData('/licence', 'POST', {
    //     label: "Licence Visiteur",
    //     dd: toSqlDate(new Date()),
    //     df: toSqlDate(getDateEndLicence()),
    //     licenceTypeId: licenceTypeId,
    //     personPhysicId: currentUser.id,
    //     roleId: roleId,
    //   });

    //   addItem('licences', licenceData);

    //   const createdClubNotif = {
    //     label: `Club rejoint avec succès !! Vous êtes désormais visiteur de ${club.label}`,
    //     time: new Date()
    //   };
    //   addItem('notifications', createdClubNotif);
    //   addItem('userClubs', club);
    //   setShowApp();
    //   navigate('/');
    // } catch (err) {
    //   console.error('Erreur lors de la création du club:', err.message);
    //   setError(err.message);
    // }
  }, [addItem, currentUser, requestToJoin]);

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

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        {error}
      </div>
    );
  }

 const getRequestByClub = (club) => {
    return requestToJoin.find(rtj => rtj.clubid == club.id && rtj.personphysicid == currentUser.id)
  } 

  const filteredClubsWithRequest = useMemo(() => {
    return filteredClubs.map((club) => {
      return {
        ...club,
        request: getRequestByClub(club)
      }
    });
  }, [filteredClubs, requestToJoin]);

  const indexOfLastClub = currentPage * clubsPerPage;
  const indexOfFirstClub = indexOfLastClub - clubsPerPage;
  const currentClubs = filteredClubsWithRequest.slice(indexOfFirstClub, indexOfLastClub);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-3xl font-bold tracking-tight">Trouver un Club</h1>
          <p className="text-muted-foreground mt-2">
            Rejoignez un club existant ou découvrez de nouvelles opportunités
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Search className="h-4 w-4" />
              Nom du club
            </label>
            <input
              type="text"
              placeholder="Rechercher un club..."
              value={nomClub}
              onChange={(e) => setNomClub(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Localisation
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

        <div className="rounded-lg border bg-card">
          <div className="p-4 space-y-4">
            {currentClubs.length > 0 ? (
              currentClubs.map((club) => (
                <ClubCard key={club.id} club={club} onClick={handleClick} />
              ))
            ) : (
              <div className="text-center py-8 space-y-4">
                <p className="text-muted-foreground">
                  Aucun club ne correspond à ces critères.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-700">
                    Vous ne trouvez pas votre club ? 
                    <a href="mailto:contact@clubmaster.fr" className="font-medium underline hover:text-blue-800 ml-1">
                      Contactez-nous
                    </a>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {filteredClubs.length > clubsPerPage && (
          <div className="flex justify-center gap-1">
            {Array.from({ length: Math.ceil(filteredClubs.length / clubsPerPage) }, (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                  currentPage === i + 1
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindClubOption;