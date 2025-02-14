import React, { useCallback, useMemo, useState } from 'react';
import useStore from '../../store/store';
import { getDisplayFormatedDate, getDateEndLicence } from "../../js/date";
import { Xmark } from 'iconoir-react';
import CustomConfirm from '../CustomConfirm';
import Modal from 'react-modal';

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
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl mx-auto mt-10 max-h-[90vh] overflow-y-auto"
      overlayClassName="fixed inset-0 bg-black/50 z-50 flex items-start justify-center"
    >
      <div className="p-6">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Licences
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Xmark className="h-6 w-6" />
          </button>
        </div>

        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="clubSelect" className="text-sm font-medium text-gray-700">
              Sélectionner un club
            </label>
            <select
              id="clubSelect"
              value={selectedClub.id}
              onChange={handleClubChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {clubs.map(club => (
                <option key={club.id} value={club.id}>{club.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Types de licences disponibles</h3>
            {filteredLicencesTypesByClub.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {filteredLicencesTypesByClub.map(type => (
                  <li 
                    key={type.id}
                    onClick={() => handleLicenceClick(type)}
                    className="py-3 px-4 hover:bg-gray-50 cursor-pointer transition-colors rounded-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{type.label}</span>
                      <span className="text-blue-600">
                        {type.price ? `${type.price}€` : 'Gratuit'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500 py-4">
                Aucun type de licence disponible pour ce club.
              </p>
            )}
          </div>

          {selectedLicence && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <h3 className="text-lg font-medium text-gray-900">
                Informations sur la licence
              </h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Nom :</span> {selectedLicence.label}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Prix :</span> {selectedLicence.price ? `${selectedLicence.price}€` : 'Gratuit'}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Date de début :</span> {getDisplayFormatedDate(new Date())}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Date de fin :</span> {getDisplayFormatedDate(getDateEndLicence(selectedLicence.duration))}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 pt-6 mt-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Annuler
          </button>
          <button
            onClick={() => setIsConfirmOpen(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sélectionner
          </button>
        </div>

        {isConfirmOpen && (
          <CustomConfirm
            onConfirm={() => {
              setIsConfirmOpen(false);
            }}
            onCancel={() => setIsConfirmOpen(false)}
          />
        )}
      </div>
    </Modal>
  );
};

export default React.memo(ModalInfoEvent);