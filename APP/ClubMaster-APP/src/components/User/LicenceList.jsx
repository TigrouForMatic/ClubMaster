import React from 'react';
import styles from '../../styles/LicenceList.module.css';
import ProgressBar from '../ProgressBar';

const LicenceList = ({ licences }) => {
    
  return (
    <section className={styles.licenceSection}>
      <h2>My Licence(s)</h2>
      <div className={styles.licenceList}>
        {licences.length > 0 ? (
          licences.map((licence, index) => (
            <div key={index} className={styles.licenceItem}>
              <div className={styles.licenceInfo}>
                <p>Role: {licence.role}</p>
                <p>Start Date: {new Date(licence.startDate).toLocaleDateString()}</p>
              </div>
              <ProgressBar value={licence.daysLeft} max={365} />
              <p>{licence.daysLeft} days left</p>
            </div>
          ))
        ) : (
          <p className={styles.noLicences}>No licences found.</p>
        )}
      </div>
    </section>
  );
};

export default LicenceList;