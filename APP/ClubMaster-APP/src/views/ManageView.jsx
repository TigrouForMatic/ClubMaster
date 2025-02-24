import React, { useState, useMemo, useEffect, useCallback } from "react";
import useStore from '../store/store';
import api from "../js/App/Api";
import ClubList from "../components/Manager/ClubList";
import LicenceList from "../components/Manager/LicenceList";
import EventTypeList from "../components/Manager/EventTypeList";
import LicenceTypeList from "../components/Manager/LicenceTypeList";
import RoleList from "../components/Manager/RoleList";
import EventList from "../components/Manager/EventList";
import RequestToJoinList from "../components/Manager/RequestToJoinList";

function ManageView() {
  const { userClubs, currentUserRoles, typesEvent, licenceTypes, productTypes, roles, requestToJoinAdmin } = useStore();
  const [licences, setLicences] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedClubId, setSelectedClubId] = useState(userClubs[0].id);

  const fetchLicences = useCallback(async (filteredClubs) => {
    try {
      setIsLoading(true);
      const arrayClubId = filteredClubs.map(club => club.id);
      const licenceData = await api.get("/licence/manage", { params: { arrayClubId: JSON.stringify(arrayClubId)}});
      setLicences(licenceData);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const filteredClubs = useMemo(() => {
    const highLevelClubIds = new Set(
      currentUserRoles
        .filter(role => role.level >= 3)
        .map(role => role.clubid)
    );

    return userClubs.filter(club => highLevelClubIds.has(club.id) && club.personmoralplan === 'Pro');
  }, [userClubs, currentUserRoles]);

  useEffect(() => {
    fetchLicences(filteredClubs); 
  }, [filteredClubs, fetchLicences]);

  const filteredTypes = useMemo(() => {
    return typesEvent.filter(type => selectedClubId ? type.clubid === selectedClubId : true);
  }, [typesEvent, selectedClubId]);

  const filteredLicences = useMemo(() => {
    // Créer des Map pour un accès rapide aux types de licence et aux rôles
    const licenceTypeMap = new Map(licenceTypes.map(type => [type.id, type]));
    const roleMap = new Map(roles.map(role => [role.id, role]));
  
    // Filtrer et transformer les licences en une seule passe
    return licences
      .filter(licence => {
        const licenceType = licenceTypeMap.get(licence.licencetypeid);
        return licenceType && licenceType.clubid === selectedClubId;
      })
      .map(licence => {
        const licenceType = licenceTypeMap.get(licence.licencetypeid);
        const role = roleMap.get(licence.roleid);
        return {
          ...licence,
          type: licenceType ? licenceType.label : undefined,
          role: role ? role.label : undefined
        };
      });
  
  }, [licences, licenceTypes, roles, selectedClubId]);

  const filteredLicenceTypes = useMemo(() => {
    return licenceTypes.filter(type => selectedClubId ? type.clubid === selectedClubId : true);
  }, [licenceTypes, selectedClubId]);

  const filteredRoles = useMemo(() => {
    return roles.filter(role => selectedClubId ? role.clubid === selectedClubId : true).sort((a, b) => a.level - b.level);
  }, [roles, selectedClubId]);

  const handleClubSelect = (clubId) => {
    setSelectedClubId(clubId);
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-lg text-gray-600">Chargement...</div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-lg text-red-600">Une erreur est survenue : {error.message}</div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl pb-24">
      <div className="space-y-8">
        {/* En-tête */}
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
            Tableau de bord
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl text-center">
            Gérez vos clubs et leurs adhérents
          </p>
        </div>

        {/* Sélection du club */}
        {filteredClubs.length === 1 ? (
          <div className="flex justify-center">
            <span className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md">
              {filteredClubs[0].label}
            </span>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-2">
            {filteredClubs.map(club => (
              <button
                key={club.id}
                onClick={() => handleClubSelect(club.id)}
                className={`px-4 py-2 rounded-md transition-all duration-300 ${
                  selectedClubId === club.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {club.label}
              </button>
            ))}
          </div>
        )}

        {/* Liste des demandes d'adhésion */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <RequestToJoinList 
            requests={requestToJoinAdmin} 
            selectedClubId={selectedClubId}
            licenceTypes={filteredLicenceTypes}
            roles={filteredRoles}
          />
        </div>

        {/* Liste des licences */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <LicenceList 
            licences={filteredLicences} 
            licenceTypes={filteredLicenceTypes} 
            roles={filteredRoles} 
            selectedClubId={selectedClubId}
          />

          {filteredLicences?.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <span className="text-sm text-gray-600">
                {filteredLicences.length} adhérents
              </span>
            </div>
          )}
        </div>

        {/* Types de licences */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <LicenceTypeList 
            licenceTypes={filteredLicenceTypes} 
            selectedClubId={selectedClubId} 
          />
        </div>

        {/* Section événements */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <EventTypeList types={filteredTypes} />
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <EventList clubId={selectedClubId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageView;