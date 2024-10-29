import React, { useCallback, useMemo, useState } from 'react';
import useStore from '../../store/store';
import { getDisplayFormatedDate, getDateEndLicence } from "../../js/date";
import styles from "../../styles/ModaleAddLicence.module.css";
import { Xmark } from 'iconoir-react';
import CustomConfirm from '../CustomConfirm';

const ModalInfoEvent = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const {licences, licenceTypes, clubs } = useStore();
  const [selectedClub, setSelectedClub] = useState(clubs[0]);
  const [selectedLicence, setSelectedLicence] = useState(null);

  const filteredLicencesTypes = useMemo(() => {
    const licenceTypeIds = new Set(licences.map(lic => lic.licencetypeid));
    const endDate = getDateEndLicence();
    return licenceTypes.filter(type => 
      !licenceTypeIds.has(type.id) && 
      !type.basic && 
      new Date() < new Date(endDate.getTime() - type.duration * 24 * 60 * 60 * 1000)
    );
  }, [licences, licenceTypes]);

  const filteredLicencesTypesByClub = useMemo(() => 
    filteredLicencesTypes.filter(type => type.clubid === selectedClub.id),
    [filteredLicencesTypes, selectedClub.id]
  );

  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget && !isConfirmOpen) {
      onClose();
    }
  }, [onClose, isConfirmOpen]);

  const handleClubChange = useCallback((event) => {
    const clubId = parseInt(event.target.value);
    setSelectedClub(clubs.find(club => club.id === clubId));
    setSelectedLicence(null);
  }, [clubs]);

  const handleLicenceClick = useCallback((licence) => {
    setSelectedLicence(licence);
  }, []);

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Licences</h2>
        <button className={styles.closeButton} onClick={onClose}>
          <Xmark />
        </button>

        <div className={styles.clubFilter}>
          <label htmlFor="clubSelect">Sélectionner un club :</label>
          <select
            id="clubSelect"
            className={styles.select}
            value={selectedClub.id}
            onChange={handleClubChange}
          >
            {clubs.map(club => (
              <option key={club.id} value={club.id}>{club.label}</option>
            ))}
          </select>
        </div>

        <div className={styles.licenceList}>
          <h3>Types de licences disponibles :</h3>
          {filteredLicencesTypesByClub.length > 0 ? (
            <ul>
              {filteredLicencesTypesByClub.map(type => (
                <li 
                  key={type.id} 
                  className={styles.licenceItem}
                  onClick={() => handleLicenceClick(type)}
                >
                  <span className={styles.licenceLabel}>{type.label}</span>
                  <span className={styles.licencePrice}>
                    {type.price ? `Prix : ${type.price}€` : 'Gratuit'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucun type de licence disponible pour ce club.</p>
          )}
        </div>

        {selectedLicence && (
          <div className={styles.licenceInfo}>
            <h3>Informations sur la licence</h3>
            <p><strong>Nom :</strong> {selectedLicence.label}</p>
            <p><strong>Prix :</strong> {selectedLicence.price ? `${selectedLicence.price}€` : 'Gratuit'}</p>
            <p><strong>Date de début :</strong> {getDisplayFormatedDate(new Date())}</p>
            <p><strong>Date de fin :</strong> {getDisplayFormatedDate(getDateEndLicence(selectedLicence.duration))}</p>
          </div>
        )}

        {isConfirmOpen && (
          <CustomConfirm
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