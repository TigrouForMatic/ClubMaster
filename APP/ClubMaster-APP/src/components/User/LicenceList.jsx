import React, { useMemo } from 'react';
import useStore from '../../store/store';
import styles from '../../styles/LicenceList.module.css';
import LicenceItem from './LicenceItem';

const LicenceList = () => {
  const { licences, licenceTypes, userClubs, roles } = useStore();

  const filteredAndSortedLicences = useMemo(() => {
    const now = new Date();
    return licences
      .sort((a, b) => new Date(a.dd) - new Date(b.dd))
      .map(e => {
        const licenceType = licenceTypes.find(t => t.id === e.licencetypeid);
        const club = userClubs.find(c => c.id === licenceType.clubid);
        const role = roles.find(r => r.id === e.roleid);
        const startDate = new Date(e.dd);
        const endDate = new Date(e.df);
        const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

        return {
          ...e,
          eventType: licenceType?.label || 'Unknown',
          clubLabel: club?.label || 'Unknown',
          role: role?.label || 'Aucun role',
          startDate,
          endDate,
          daysLeft,
        };
      });
  }, [licences, licenceTypes, userClubs, roles]);

  if (filteredAndSortedLicences.length === 0) {
    return (
      <section className={styles.licenceSection}>
        <h2>Mes Licence(s)</h2>
        <p className={styles.noLicences}>Aucunes licences actives.</p>
      </section>
    );
  }

  return (
    <section className={styles.licenceSection}>
      <h2>My Licence(s)</h2>
      <div className={styles.licenceList}>
        {filteredAndSortedLicences.map((licence) => (
          <LicenceItem key={licence.id} licence={licence} />
        ))}
      </div>
    </section>
  );
};

export default LicenceList;