import React, { useState, useMemo, useEffect } from 'react';
import useStore from '../../store/store';
import styles from '../../styles/LicenceList.module.css';
import LicenceItem from './LicenceItem';
import { MdAdd } from 'react-icons/md';
import ModalAddLicence from '../Modale/ModalAddLicence';

const LicenceList = () => {
  const { licences, licenceTypes, userClubs, roles } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showOldLicences, setShowOldLicences] = useState(false);

  const oldLicences = useMemo(() => {
    const now = new Date();
    return licences
      .filter(e => new Date(e.df) < now)
      .sort((a, b) => new Date(a.dd) - new Date(b.dd))
      .map(e => {
        const licenceType = licenceTypes.find(t => t.id === e.licencetypeid);
        const club = userClubs.find(c => c.id === licenceType.clubid);
        const role = roles.find(r => r.id === e.roleid);
        const startDate = new Date(e.dd);
        const endDate = new Date(e.df);
        const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
        const duration = (endDate - startDate) / 86400000;

        return {
          ...e,
          eventType: licenceType?.label || 'Unknown',
          clubLabel: club?.label || 'Unknown',
          role: role?.label || 'Aucun role',
          startDate,
          endDate,
          daysLeft,
          duration : duration || 365
        };
      });
  }, [licences, licenceTypes, userClubs, roles]);

  const filteredAndSortedLicences = useMemo(() => {
    const now = new Date();
    return licences
      .filter(e => new Date(e.df) > now)
      .sort((a, b) => new Date(a.dd) - new Date(b.dd))
      .map(e => {
        const licenceType = licenceTypes.find(t => t.id === e.licencetypeid);
        const club = userClubs.find(c => c.id === licenceType.clubid);
        const role = roles.find(r => r.id === e.roleid);
        const startDate = new Date(e.dd);
        const endDate = new Date(e.df);
        const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
        const duration = (endDate - startDate) / 86400000;

        return {
          ...e,
          eventType: licenceType?.label || 'Unknown',
          clubLabel: club?.label || 'Unknown',
          role: role?.label || 'Aucun role',
          startDate,
          endDate,
          daysLeft,
          duration : duration || 365
        };
      });
  }, [licences, licenceTypes, userClubs, roles]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section className={styles.licenceSection}>
      <div className={styles.licenceListHeader}>
        <h2>Mes Licence(s)</h2>
        <button className={styles.addButton} onClick={handleOpenModal}>
          Ajouter
          <MdAdd />
        </button>
      </div>
      {filteredAndSortedLicences.length > 0 && (
        <div className={styles.licenceList}>
          {filteredAndSortedLicences.map((licence) => (
          <LicenceItem key={licence.id} licence={licence} />
          ))}
        </div>
      )}  
      {filteredAndSortedLicences.length === 0 &&(
        <p className={styles.noLicences}>Aucunes licences actives.</p>
      )}

      {oldLicences.length > 0 && (
        <button className={styles.showOldLicences} onClick={() => setShowOldLicences(!showOldLicences)}>
          {showOldLicences ? 'Masquer les anciennes licences' : 'Afficher les anciennes licences'}
        </button>
      )}
      {showOldLicences && (
        <div className={styles.oldLicences}>
          {oldLicences.map((licence) => (
            <LicenceItem key={licence.id} licence={licence} isOld={true}/>
          ))}
        </div>
      )}

      {/* La modale est affichée si isModalOpen est true */}
      {isModalOpen && <ModalAddLicence isOpen={isModalOpen} onClose={closeModal} />}
    </section>
  );
};

export default LicenceList;