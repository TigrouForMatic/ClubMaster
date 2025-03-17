import React, { useState } from "react";
import UserImage from "../UserImage";
import { BirthdayCake, EditPencil, Trash } from 'iconoir-react';
import { getDisplayFormatedDate } from '../../js/date';
import Select from 'react-select';
import ModaleExportLicences from '../Modale/ModaleExportLicences';

const LicenceList = React.memo(({ licences, licenceTypes, roles, selectedClubId }) => {
  const [filterType, setFilterType] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  
  const filteredLicences = React.useMemo(() => {
    return licences.filter(licence => {
      const matchesSearch = licence.firstname.toLowerCase().includes(searchQuery.toLowerCase()) || licence.lastname.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = !filterType || licence.licencetypeid == filterType;
      const matchesRole = !filterRole || licence.roleid == filterRole;
      
      if (!filterEndDate) return matchesSearch && matchesType && matchesRole;
      
      const endDate = new Date(licence.df);
      const today = new Date();
      const monthsDiff = (endDate - today) / (1000 * 60 * 60 * 24 * 30);
      
      switch(filterEndDate) {
        case '1month': return monthsDiff <= 1;
        case '3months': return monthsDiff <= 3;
        case '6months': return monthsDiff <= 6;
        case '1year': return monthsDiff <= 12;
        default: return true;
      }
    });
  }, [licences, filterType, filterRole, filterEndDate, searchQuery]);

  const getDataForSelectFromLicenceTypes = React.useMemo(() => 
    licenceTypes.map(type => ({
      value: type.id,
      label: type.label
    })),
  [licenceTypes]);

  const getDataForSelectFromRoles = React.useMemo(() => 
    roles.map(role => ({
      value: role.id,
      label: role.label
    })),
  [roles]);

  const endDateOptions = [
    { value: '', label: 'Toutes les dates' },
    { value: '1month', label: 'Dans 1 mois' },
    { value: '3months', label: 'Dans 3 mois' },
    { value: '6months', label: 'Dans 6 mois' },
    { value: '1year', label: 'Dans 1 an' }
  ];

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Adhérents</h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsExportModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-blue-500 text-white hover:bg-blue-600 h-10 px-4 py-2"
          >
            Exporter
          </button>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-blue-500 text-white hover:bg-blue-600 h-10 px-4 py-2">
            Ajouter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="space-y-2">
          <input 
            type="text" 
            placeholder="Rechercher" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-4 py-1.5 bg-white rounded-md cursor-default react-select-container border border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2 relative z-20">
          <Select
            value={filterType ? { value: filterType, label: licenceTypes.find(t => t.id == filterType)?.label } : null}
            onChange={(option) => setFilterType(option ? option.value : '')}
            options={[{ value: '', label: 'Tous les types' }, ...getDataForSelectFromLicenceTypes]}
            placeholder="Sélectionner un type"
            className="react-select-container"
            classNamePrefix="react-select"
            isClearable
          />
        </div>

        <div className="space-y-2 relative z-20">
          <Select
            value={endDateOptions.find(option => option.value === filterEndDate)}
            onChange={(option) => setFilterEndDate(option ? option.value : '')}
            options={endDateOptions}
            placeholder="Sélectionner une période"
            className="react-select-container"
            classNamePrefix="react-select"
            isClearable
            styles={{
              singleValue: (base) => ({
                  ...base,
                  color: '#6B7280', // Couleur grise (gray-500)
              })
            }}
          />
        </div>

        <div className="space-y-2 relative z-20">
          <Select
            value={filterRole ? { value: filterRole, label: roles.find(r => r.id == filterRole)?.label } : null}
            onChange={(option) => setFilterRole(option ? option.value : '')}
            options={[{ value: '', label: 'Tous les rôles' }, ...getDataForSelectFromRoles]}
            placeholder="Sélectionner un rôle"
            className="react-select-container"
            classNamePrefix="react-select"
            isClearable
          />
        </div>
      </div>

      <div className="relative w-full overflow-y-auto overflow-x-hidden max-h-[600px] min-h-[600px] scrollbar-hide">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b sticky top-0 bg-white z-10">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Personne</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Licence</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date de début</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date de fin</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Contact</th>
              <th className="h-12 w-[100px] px-4"></th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {filteredLicences.map(licence => (
              <tr key={licence.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <td className="p-4 align-middle">
                  <div className="flex items-center gap-3">
                    <UserImage name={licence.firstname + ' ' + licence.lastname} size={40} />
                    <div className="flex flex-col">
                      <span className="font-medium">{licence.firstname + ' ' + licence.lastname}</span>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <BirthdayCake className="h-4 w-4" />
                        {getDisplayFormatedDate(licence.naissancedate)}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="p-4 align-middle">{licence.licencefederation}</td>
                <td className="p-4 align-middle">{licence.label}</td>
                <td className="p-4 align-middle">{getDisplayFormatedDate(licence.dd)}</td>
                <td className="p-4 align-middle">{getDisplayFormatedDate(licence.df)}</td>
                <td className="p-4 align-middle">{licence.role}</td>
                <td className="p-4 align-middle">
                  <div className="flex flex-col gap-1">
                    <a href={`mailto:${licence.login}`} className="text-sm cursor-pointer">{licence.login}</a>
                    <a href={`tel:${licence.phonenumber}`} className="text-sm text-muted-foreground cursor-pointer">{licence.phonenumber}</a>
                  </div>
                </td>
                <td className="p-4 align-middle">
                  <div className="flex items-center gap-2">
                    <button className="inline-flex items-center justify-center rounded-md w-8 h-8 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none hover:bg-muted">
                      <EditPencil className="h-4 w-4" />
                    </button>
                    <button className="inline-flex items-center justify-center rounded-md w-8 h-8 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none hover:bg-red-100 text-red-700">
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredLicences.length === 0 && (
          <p className="text-center text-muted-foreground py-6">Aucunes licences actives.</p>
        )}
      </div>
      <ModaleExportLicences 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        selectedClubId={selectedClubId} 
      />
    </div>
  );
});

LicenceList.displayName = 'LicenceList';

export default LicenceList;
