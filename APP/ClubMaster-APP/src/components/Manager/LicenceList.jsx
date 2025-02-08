import React from "react";
import UserImage from "../UserImage";
import { BirthdayCake, EditPencil, Trash } from 'iconoir-react';
import { getDisplayFormatedDate } from '../../js/date';
import { useState } from 'react';

const LicenceList = React.memo(({ licences, licenceTypes, roles }) => {
  const [filterType, setFilterType] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLicences = React.useMemo(() => {
    return licences.filter(licence => {
      const matchesSearch = licence.name.toLowerCase().includes(searchQuery.toLowerCase());
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

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Adhérents</h2>
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-blue-500 text-white hover:bg-blue-600 h-10 px-4 py-2">
          Ajouter
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <input 
          type="text" 
          placeholder="Rechercher" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-[250px]"
        />
        <select 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-[200px]"
        >
          <option value="">Type de licence</option>
          {licenceTypes.map(type => (
            <option key={type.id} value={type.id}>{type.label}</option>
          ))}
        </select>
        <select 
          value={filterEndDate} 
          onChange={(e) => setFilterEndDate(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-[200px]"
        >
          <option value="">Date de fin</option>
          <option value="1month" className="text-red-500">Dans 1 mois</option>
          <option value="3months" className="text-orange-500">Dans 3 mois</option>
          <option value="6months" className="text-blue-500">Dans 6 mois</option>
          <option value="1year" className="text-green-500">Dans 1 an</option>
        </select>
        <select 
          value={filterRole} 
          onChange={(e) => setFilterRole(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-[200px]"
        >
          <option value="">Rôle</option>
          {roles.map(role => (
            <option key={role.id} value={role.id}>{role.label}</option>
          ))}
        </select>
      </div>

      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
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
                    <UserImage name={licence.name} size={40} />
                    <div className="flex flex-col">
                      <span className="font-medium">{licence.name}</span>
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
                    <span className="text-sm">{licence.emailaddress}</span>
                    <span className="text-sm text-muted-foreground">{licence.phonenumber}</span>
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
    </div>
  );
});

LicenceList.displayName = 'LicenceList';

export default LicenceList;
