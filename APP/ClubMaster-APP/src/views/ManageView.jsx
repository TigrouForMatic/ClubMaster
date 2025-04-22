import React, { useState, useMemo } from "react";
import useStore from '../store/store';
import ClubList from "../components/Manager/ClubList";
import LicenceList from "../components/Manager/LicenceList";
import EventTypeList from "../components/Manager/EventTypeList";
import LicenceTypeList from "../components/Manager/LicenceTypeList";
import RoleList from "../components/Manager/RoleList";
import EventList from "../components/Manager/EventList";
import RequestToJoinList from "../components/Manager/RequestToJoinList";
import MembershipForm from "../components/MemberShip/MembershipForm";

function ManageView() {
  const { userClubs, currentUserRoles, typesEvent, licenceTypes, productTypes, roles, licencesAdmin } = useStore();
  const [selectedClubId, setSelectedClubId] = useState(userClubs[0].id);
  const [activeSection, setActiveSection] = useState('dashboard');

  const filteredClubs = useMemo(() => {
    const highLevelClubIds = new Set(
      currentUserRoles
        .filter(role => role.level >= 3)
        .map(role => role.clubid)
    );

    return userClubs.filter(club => highLevelClubIds.has(club.id) && club.planlabel === 'Pro');
  }, [userClubs, currentUserRoles]);

  const filteredTypes = useMemo(() => {
    return typesEvent.filter(type => selectedClubId ? type.clubid === selectedClubId : true);
  }, [typesEvent, selectedClubId]);

  const filteredLicences = useMemo(() => {
    const licenceTypeMap = new Map(licenceTypes.map(type => [type.id, type]));
    const roleMap = new Map(roles.map(role => [role.id, role]));
  
    return licencesAdmin
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
  }, [licencesAdmin, licenceTypes, roles, selectedClubId]);

  const filteredLicenceTypes = useMemo(() => {
    return licenceTypes.filter(type => selectedClubId ? type.clubid === selectedClubId : true);
  }, [licenceTypes, selectedClubId]);

  const filteredRoles = useMemo(() => {
    return roles.filter(role => selectedClubId ? role.clubid === selectedClubId : true).sort((a, b) => a.level - b.level);
  }, [roles, selectedClubId]);

  const handleClubSelect = (clubId) => {
    setSelectedClubId(clubId);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Statistiques</h3>
                <p>Nombre d'adhérents : {filteredLicences.length}</p>
                <p>Nombre d'événements : {filteredTypes.length}</p>
              </div>
            </div>
          </div>
        );
      case 'adherents':
        return (
          <div className="space-y-6">
            <RequestToJoinList 
              selectedClubId={selectedClubId}
              licenceTypes={filteredLicenceTypes}
              roles={filteredRoles}
            />
            <LicenceList 
              licences={filteredLicences} 
              licenceTypes={filteredLicenceTypes} 
              roles={filteredRoles} 
              selectedClubId={selectedClubId}
            />
          </div>
        );
      case 'evenements':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <EventTypeList types={filteredTypes} />
            </div>
            <div className="lg:col-span-3">
              <EventList clubId={selectedClubId} />
            </div>
          </div>
        );
      case 'shop':
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Boutique</h3>
            <p>Section boutique en développement</p>
          </div>
        );
      case 'inventaire':
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Inventaire</h3>
            <p>Section inventaire en développement</p>
          </div>
        );
      case 'club':
        return (
          <div className="space-y-6">
            <LicenceTypeList 
              licenceTypes={filteredLicenceTypes} 
              selectedClubId={selectedClubId} 
            />
            <RoleList roles={filteredRoles} />
          </div>
        );
      default:
        return null;
    }
  };

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

        {/* Barre de navigation */}
        <nav className="bg-white shadow rounded-lg overflow-hidden">
          <div className="flex flex-wrap justify-center">
            {[
              { id: 'dashboard', label: 'Tableau de bord' },
              { id: 'adherents', label: 'Adhérents' },
              { id: 'evenements', label: 'Événements' },
              { id: 'shop', label: 'Boutique' },
              { id: 'inventaire', label: 'Inventaire' },
              { id: 'club', label: 'Club' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`px-6 py-3 text-sm font-medium transition-all duration-300 ${
                  activeSection === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Contenu de la section active */}
        <div className="mt-6">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}

export default ManageView;