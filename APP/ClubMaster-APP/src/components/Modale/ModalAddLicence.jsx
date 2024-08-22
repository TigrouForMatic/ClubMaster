import React, { useCallback, useMemo, useState } from 'react';
import useStore from '../../store/store';
import styles from "../../styles/ModaleAddLicence.module.css";
import { Xmark } from 'iconoir-react';
import CustomConfirm from '../CustomConfirm';

const ModalInfoEvent = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { licences, licenceTypes, clubs } = useStore();
  const [selectedClub, setSelectedClub] = useState(clubs[0]);

  const filteredLicencesTypes = useMemo(() => {
    const licenceTypeIds = new Set(licences.map(lic => lic.licencetypeid));
    return licenceTypes.filter(type => !licenceTypeIds.has(type.id) && !type.basic);
  }, [licences, licenceTypes]);

  const filteredLicencesTypesByClub = useMemo(() => {
    return filteredLicencesTypes.filter(type => type.clubid === selectedClub.id);
  }, [filteredLicencesTypes, selectedClub]);

  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget && !isConfirmOpen) {
      onClose();
    }
  }, [onClose, isConfirmOpen]);

  const handleClubChange = (event) => {
    const clubId = parseInt(event.target.value);
    setSelectedClub(clubs.find(club => club.id === clubId));
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className={styles.closeButton}>
          <Xmark />
        </button>
        <h2 className={styles.title}>Licences</h2>

        {/* Filtre par club */}
        <div className={styles.clubFilter}>
          <label htmlFor="clubSelect">Sélectionner un club : </label>
          <select
            id="clubSelect"
            value={selectedClub.id}
            onChange={handleClubChange}
            className={styles.select}
          >
            {clubs.map(club => (
              <option key={club.id} value={club.id}>{club.label}</option>
            ))}
          </select>
        </div>

        {/* Liste des types de licences */}
        <div className={styles.licenceList}>
          <h3>Types de licences disponibles :</h3>
          {filteredLicencesTypesByClub.length > 0 ? (
            <ul>
              {filteredLicencesTypesByClub.map(type => (
                <li key={type.id} className={styles.licenceItem}>
                  <span className={styles.licenceLabel}>{type.label}</span>
                  {type.price ? (
                      <span className={styles.licencePrice}>Prix : {type.price}€</span>
                  ) : (
                      <span className={styles.licencePrice}>Gratuit</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucun type de licence disponible pour ce club.</p>
          )}
        </div>
        
        {isConfirmOpen && (
          <CustomConfirm 
            isOpen={isConfirmOpen}
            message="Êtes-vous sûr de vouloir effectuer cette action ?"
            onConfirm={() => {
              // Add confirmation logic here
              setIsConfirmOpen(false);
            }}
            onCancel={() => setIsConfirmOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(ModalInfoEvent);