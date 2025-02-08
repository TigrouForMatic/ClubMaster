import React, { useState } from "react";
import Modal from 'react-modal';
import Select from 'react-select';
import api from '../../js/App/Api';
import { read, utils, writeFileXLSX } from 'xlsx';
import { Download, X } from 'lucide-react';

const ModaleExportLicences = React.memo(({ isOpen, onClose, selectedClubId }) => {
  const [etat, setEtat] = useState('tout');
  const [isDelete, setIsDelete] = useState(false);

  const handleExport = async () => {
    try {
      const response = await api.get(`/licence/export`, {
        responseType: 'json',
        params: {
          clubId: selectedClubId,
          etat: etat,
          isDelete: isDelete
        }
      });

      const ws = utils.json_to_sheet(response);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Data");
      writeFileXLSX(wb, "Licences.xlsx");

      onClose();

    } catch (error) {
      console.error('Erreur lors de l\'export', error);
    }
  };

  const etatOptions = [
    { value: 'tout', label: 'Toutes les licences' },
    { value: 'actif', label: 'Licences actives' },
    { value: 'inactif', label: 'Licences inactives' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-auto mt-10 overflow-hidden"
      overlayClassName="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <div className="flex flex-col h-full max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-gray-500" />
            <h2 className="text-xl font-semibold text-gray-900">
              Exporter les licences
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                État des licences
              </label>
              <Select
                value={etatOptions.find(option => option.value === etat)}
                onChange={(option) => setEtat(option ? option.value : '')}
                options={etatOptions}
                placeholder="Sélectionner un état"
                className="react-select-container"
                classNamePrefix="react-select"
                isClearable
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isDelete"
                checked={isDelete}
                onChange={(e) => setIsDelete(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isDelete" className="text-sm text-gray-700">
                Inclure les licences supprimées
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Exporter
          </button>
        </div>
      </div>
    </Modal>
  );
});

ModaleExportLicences.displayName = 'ModaleExportLicences';

export default ModaleExportLicences;
