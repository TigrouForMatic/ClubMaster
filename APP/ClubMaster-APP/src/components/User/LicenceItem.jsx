import React from 'react';
import ProgressBar from '../ProgressBar';
import styles from '../../styles/LicenceList.module.css';
import { getDisplayFormatedDate } from '../../js/date';

const LicenceItem = ({ licence }) => (
  <div className={styles.licenceCard}>
    <div className={styles.licenceHeader}>
      <h3>{licence.eventType}</h3>
      <span className={styles.licenceRole}>{licence.role}</span>
    </div>
    <div className={styles.licenceBody}>
      <p className={styles.licenceClub}>{licence.clubLabel}</p>
      <div className={styles.licenceDates}>
        <p>
          <span>Début:</span> {getDisplayFormatedDate(licence.startDate)}
        </p>
        <p>
          <span>Fin:</span> {getDisplayFormatedDate(licence.endDate)}
        </p>
      </div>
    </div>
    <div className={styles.licenceFooter}>
      <ProgressBar value={licence.duration - licence.daysLeft} max={licence.duration} />
      <p className={styles.licenceDaysLeft}>{licence.daysLeft} jours restants</p>
    </div>
  </div>
);

export default LicenceItem;