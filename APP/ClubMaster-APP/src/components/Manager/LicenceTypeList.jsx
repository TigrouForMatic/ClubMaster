import React from "react";
import styles from "../../styles/ManageView.module.css";
import { EditPencil } from 'iconoir-react';
import { daysToYearMonthDay } from '../../js/date';

const LicenceTypeList = React.memo(({ licenceTypes }) => (
  <div className={styles.section}>
    <div className={styles.sectionHeader}>
      <h2 className={styles.subtitle}>Types de licences</h2>
      <button className={styles.addButton}>Ajouter</button>
    </div>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Label</th>
          <th>Prix</th>
          <th>Type</th>
          <th>Durée</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {licenceTypes.map(type => (
          <tr key={type.id}>
            <td>{type.label}</td>
            <td>{type.price !== null ? `${type.price} €` : 'Gratuit'}</td>
            <td>{type.basic ? 'Basic' : 'Advanced'}</td>
            <td>{daysToYearMonthDay(type.duration)}</td>
            <td>
              <button className={styles.editButton}><EditPencil /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
));

export default LicenceTypeList;
