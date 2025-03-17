import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Select from 'react-select';
import api from '../../js/App/Api';
import useStore from '../../store/store';
import { getDateEndLicence } from '../../js/date';
import { toSqlDate } from '../../js/date';

const ModalAcceptRequestToJoin = ({ isOpen, onClose, request, licenceTypes, roles }) => {
  const [selectedLicenceType, setSelectedLicenceType] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const { addItem, updateItem } = useStore();

  useEffect(() => {
    // Sélectionner par défaut le rôle de niveau 0 et la licence de base
    const defaultRole = roles.find(role => role.level === 0);
    const defaultLicenceType = licenceTypes.find(type => type.basic === true);
    
    setSelectedRole(defaultRole ? { value: defaultRole.id, label: defaultRole.label } : null);
    setSelectedLicenceType(defaultLicenceType ? { 
      value: defaultLicenceType.id, 
      label: defaultLicenceType.label 
    } : null);
  }, [roles, licenceTypes]);

  // Ajout d'une vérification pour request null
  if (!request) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Mettre à jour le statut de la demande
      const responseRequest = await api.put(`/requestToJoin/${request.id}`, { 
        status: 'accepted' 
      });
      updateItem('requestToJoinAdmin', request.id, responseRequest);

      // Créer la nouvelle licence
      const licenceData = await api.post('/licence/manage', {
        label: selectedLicenceType.label,
        dd: toSqlDate(new Date()),
        df: toSqlDate(getDateEndLicence()),
        licenceTypeId: selectedLicenceType.value,
        loginid: request.loginid,
        roleId: selectedRole.value,
      });

      addItem('licencesAdmin', licenceData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'acceptation de la demande:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl mx-auto mt-10 max-h-[90vh] overflow-y-auto scrollbar-hide"
      overlayClassName="fixed inset-0 bg-black/50 z-50 flex items-start justify-center"
    >
      <div className="p-6">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Accepter la demande d'adhésion
          </h2>
          <button 
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
    
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-700">
                Nom de la personne
              </label>
              <div className="p-2 bg-zinc-50 rounded-md">
                {request.firstName + ' ' + request.lastName}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-700">
                Club
              </label>
              <div className="p-2 bg-zinc-50 rounded-md">
                {request.clublabel}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700">
              Type de licence
            </label>
            <Select
              value={selectedLicenceType}
              onChange={setSelectedLicenceType}
              options={licenceTypes.map(type => ({
                value: type.id,
                label: type.label
              }))}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Sélectionner un type de licence"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700">
              Rôle
            </label>
            <Select
              value={selectedRole}
              onChange={setSelectedRole}
              options={roles.map(role => ({
                value: role.id,
                label: role.label
              }))}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Sélectionner un rôle"
              required
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-md shadow-sm hover:bg-zinc-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700"
            >
              Accepter et créer la licence
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ModalAcceptRequestToJoin;