import React, { useState } from "react";
import { EditPencil, Trash } from 'iconoir-react';
import { daysToYearMonthDay } from '../../js/date';
import FormLicenceType from '../Modale/FormLicenceType';
import api from '../../js/App/Api';
import useStore from "../../store/store";
import CustomConfirm from '../CustomConfirm';

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

  const [isOpenConfirm, setIsOpenConfirm] = useState(false);

  const handleCloseConfirm = () => {
    setIsOpenConfirm(false);
    setSelectedLicenceType(null);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/licenceType/${selectedLicenceType.id}`);
      deleteItem('licenceTypes', selectedLicenceType.id);
    } catch (error) {
      console.error('Erreur lors de la suppression du type de licence:', error);
    }
    setIsOpenConfirm(false);
    setSelectedLicenceType(null);
  };

  const handleDeleteClick = (licenceType) => {
    setIsOpenConfirm(true);
    setSelectedLicenceType(licenceType);
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Types de licences</h2>
        <button 
          onClick={() => handleOpenForm(null)}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-black text-white hover:bg-gray-800 h-10 px-4 py-2"
        >
          Ajouter
        </button>
      </div>

      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Label</th>
              <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Prix</th>
              <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Type</th>
              <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Durée</th>
              <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Visible par tous</th>
              <th className="h-12 w-[100px] px-4"></th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {licenceTypes.map(type => (
              <tr key={type.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <td className="p-4 align-middle">{type.label}</td>
                <td className="p-4 align-middle">{type.price !== null ? `${type.price} €` : 'Gratuit'}</td>
                <td className="p-4 align-middle">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    type.basic ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {type.basic ? 'Basic' : 'Advanced'}
                  </span>
                </td>
                <td className="p-4 align-middle">{daysToYearMonthDay(type.duration)}</td>
                <td className="p-4 align-middle">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    type.private ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {type.private ? 'Oui' : 'Non'}
                  </span>
                </td>
                <td className="p-4 align-middle">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenForm(type)}
                      className="inline-flex items-center justify-center rounded-md w-8 h-8 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none hover:bg-muted"
                    >
                      <EditPencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(type)}
                      className="inline-flex items-center justify-center rounded-md w-8 h-8 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none hover:bg-red-100 text-red-700"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <FormLicenceType isOpen={isOpen} onClose={handleCloseForm} selectedClubId={selectedClubId} licenceType={selectedLicenceType} />
      <CustomConfirm isOpen={isOpenConfirm} onCancel={handleCloseConfirm} onConfirm={handleDelete} message="Voulez-vous vraiment supprimer ce type de licence ?" />
    </div>
  );
});
export default LicenceTypeList;
