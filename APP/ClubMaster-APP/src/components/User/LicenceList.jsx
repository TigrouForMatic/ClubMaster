import React from 'react';
import useStore from '../../store/store';
import ProgressBar from '../ProgressBar';
import styles from '../../styles/LicenceList.module.css';

const LicenceList = () => {

    const { currentUser, userClubs, licences, licenceTypes, roles } = useStore();

    // Licence : {
    //     dc: "2024-06-30T00:00:00.000Z"
    //     dd: "2024-07-15T00:00:00.000Z"
    //     df: "2024-08-31T00:00:00.000Z"
    //     dm: "2024-06-30T00:00:00.000Z"
    //     id: 1
    //     label: "Licence Visiteur"
    //     licencetypeid: 1
    //     personphysicid: 1
    //     roleid: 1
    // }  

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