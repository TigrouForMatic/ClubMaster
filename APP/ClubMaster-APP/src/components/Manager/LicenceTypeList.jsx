import React, { useState } from "react";
import styles from "../../styles/ManageView.module.css";
import { EditPencil, Trash } from 'iconoir-react';
import { daysToYearMonthDay } from '../../js/date';
import FormLicenceType from '../Modale/FormLicenceType';

const LicenceTypeList = React.memo(({ licenceTypes }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [licenceType, setLicenceType] = useState(null);

  const handleOpenForm = (licenceType) => {
    setLicenceType(licenceType);
    setIsOpen(true);
  };

  const handleCloseForm = () => {
    setIsOpen(false);
    setLicenceType(null);
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.subtitle}>Types de licences</h2>
        <button className={styles.addButton} onClick={() => handleOpenForm(null)}>Ajouter</button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Label</th>
            <th>Prix</th>
            <th>Type</th>
            <th>Durée</th>
            <th></th>
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
                <button className={styles.editButton} onClick={() => handleOpenForm(type)}><EditPencil /></button>
                <button className={styles.deleteButton}><Trash /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <FormLicenceType isOpen={isOpen} onClose={handleCloseForm} licenceType={licenceType} />
    </div>
  );
});
export default LicenceTypeList;
