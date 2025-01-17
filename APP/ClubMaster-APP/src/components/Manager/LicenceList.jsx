import React from "react";
import styles from "../../styles/ManageView.module.css";
import UserImage from "../UserImage";
import { BirthdayCake, EditPencil, Trash } from 'iconoir-react';
import { getDisplayFormatedDate } from '../../js/date';
import { useState, useEffect } from 'react';

const LicenceList = React.memo(({ licences, licenceTypes, roles }) => {
  const [filterType, setFilterType] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    console.log('licences', licences);
  }, [licences]);

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

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleTypeChange = (e) => setFilterType(e.target.value);
  const handleRoleChange = (e) => setFilterRole(e.target.value);
  const handleEndDateChange = (e) => setFilterEndDate(e.target.value);

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.subtitle}>Adhérents</h2>
        <button className={styles.addButton}>Ajouter</button>
      </div>
      <div className={styles.tableContainer}>
        <div className={styles.filterTable}>
          <input 
            type="text" 
            placeholder="Rechercher" 
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <select value={filterType} onChange={handleTypeChange}>
            <option value="">Type de licence</option>
            {licenceTypes.map(type => (
              <option key={type.id} value={type.id}>{type.label}</option>
            ))}
          </select>
          <select value={filterEndDate} onChange={handleEndDateChange}>
            <option value="">Date de fin</option>
            <option value="1month" style={{color: 'red'}}>Dans 1 mois</option>
            <option value="3months" style={{color: 'orange'}}>Dans 3 mois</option>
            <option value="6months" style={{color: 'blue'}}>Dans 6 mois</option>
            <option value="1year" style={{color: 'green'}}>Dans 1 an</option>
          </select>
          <select value={filterRole} onChange={handleRoleChange}>
            <option value="">Rôle</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>{role.label}</option>
            ))}
          </select>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Personne</th>
              <th>Licence</th>
              <th>Type</th>
              <th>Date de début</th>
              <th>Date de fin</th>
              <th>Role</th>
              <th>Contact</th>
            </tr>
          </thead>
          <tbody>
            {filteredLicences.length > 0 && filteredLicences.map(licence => (
              <tr key={licence.id}>
                <td>
                  <div className={styles.userInfo}>
                    <UserImage name={licence.name} size={40} />
                    <div className={styles.userDetails}>
                      <span className={styles.userName}>{licence.name}</span>
                      <span className={styles.userBirthday}>
                        <BirthdayCake />
                        {getDisplayFormatedDate(licence.naissancedate)}
                      </span>
                    </div>
                  </div>
                </td>
                <td>{licence.licencefederation}</td>
                <td>{licence.label}</td>
                <td>{getDisplayFormatedDate(licence.dd)}</td>
                <td>{getDisplayFormatedDate(licence.df)}</td>
                <td>{licence.role}</td>
                <td>
                  <div className={styles.contactInfo}>
                    <span className={styles.email}>{licence.emailaddress}</span>
                    <span className={styles.phone}>{licence.phonenumber}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          {filteredLicences.length === 0 && (
            <p className={styles.noLicences}>Aucunes licences actives.</p>
          )}
        </table>
      </div>
    </div>
  );
});

LicenceList.displayName = 'LicenceList';

export default LicenceList;
