import React from "react";
import styles from "../../styles/ManageView.module.css";
import UserImage from "../UserImage";
import { BirthdayCake, EditPencil } from 'iconoir-react';
import { getDisplayFormatedDate } from '../../js/date';

const LicenceList = React.memo(({ licences }) => (
  <div className={styles.section}>
    <div className={styles.sectionHeader}>
      <h2 className={styles.subtitle}>Licenciés</h2>
      <button className={styles.addButton}>Ajouter</button>
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
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {licences.map(licence => (
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
            <td>{licence.number}</td>
            <td>{licence.label}</td>
            <td>{getDisplayFormatedDate(licence.startDate)}</td>
            <td>{getDisplayFormatedDate(licence.endDate)}</td>
            <td>{licence.role}</td>
            <td>
              <div className={styles.contactInfo}>
                <span className={styles.email}>{licence.emailaddress}</span>
                <span className={styles.phone}>{licence.phonenumber}</span>
              </div>
            </td>
            <td>
              <button className={styles.editButton}><EditPencil /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
));

export default LicenceList;
