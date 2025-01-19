import React, { useState } from "react";
import styles from "../../styles/ManageView.module.css";
import { EditPencil, Trash } from 'iconoir-react';
import { daysToYearMonthDay } from '../../js/date';
import FormLicenceType from '../Modale/FormLicenceType';
import api from '../../js/App/Api';
import useStore from "../../store/store";

const LicenceTypeList = React.memo(({ licenceTypes, selectedClubId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLicenceType, setSelectedLicenceType] = useState(null);

  const { deleteItem } = useStore();

  const handleOpenForm = (licenceType) => {
    setSelectedLicenceType(licenceType);
    setIsOpen(true);
  };

  const handleCloseForm = () => {
    setIsOpen(false);
    setSelectedLicenceType(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce type de licence ?')) {
      try {
        await api.delete(`/licenceType/${id}`);
        deleteItem('licenceTypes', id);
      } catch (error) {
        console.error('Erreur lors de la suppression du type de licence:', error);
      }
    }
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
            <th>Visible par tous</th>
          </tr>
        </thead>
        <tbody>
          {licenceTypes.map(type => (
            <tr key={type.id}>
              <td>{type.label}</td>
              <td>{type.price !== null ? `${type.price} €` : 'Gratuit'}</td>
              <td>{type.basic ? 'Basic' : 'Advanced'}</td>
              <td>{daysToYearMonthDay(type.duration)}</td>
              <td>{type.private ? 'Oui' : 'Non'}</td>
              <td>
                <button className={styles.editButton} onClick={() => handleOpenForm(type)}><EditPencil /></button>
                <button className={styles.deleteButton} onClick={() => handleDelete(type.id)}><Trash /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <FormLicenceType isOpen={isOpen} onClose={handleCloseForm} selectedClubId={selectedClubId} licenceType={selectedLicenceType} />
    </div>
  );
});
export default LicenceTypeList;
