import React, { useState } from "react";
import { EditPencil, Trash } from 'iconoir-react';
import api from '../../js/App/Api';
import useStore from "../../store/store";
import CustomConfirm from '../CustomConfirm';

const EventTypeList = React.memo(({ types }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState(null);
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  
  const { deleteItem } = useStore();

  const handleOpenForm = (eventType) => {
    setSelectedEventType(eventType);
    setIsOpen(true);
  };

  const handleCloseForm = () => {
    setIsOpen(false);
    setSelectedEventType(null);
  };

  const handleCloseConfirm = () => {
    setIsOpenConfirm(false);
    setSelectedEventType(null);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/eventType/${selectedEventType.id}`);
      deleteItem('eventTypes', selectedEventType.id);
    } catch (error) {
      console.error('Erreur lors de la suppression du type d\'événement:', error);
    }
    setIsOpenConfirm(false);
    setSelectedEventType(null);
  };

  const handleDeleteClick = (eventType) => {
    setIsOpenConfirm(true);
    setSelectedEventType(eventType);
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Types d'événements</h2>
        <button 
          onClick={() => handleOpenForm(null)}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-blue-500 text-white hover:bg-blue-600 h-10 px-4 py-2"
        >
          Ajouter
        </button>
      </div>

      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Label</th>
              <th className="h-12 w-[100px] px-4"></th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {types.map(type => (
              <tr key={type.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <td className="p-4 align-middle">{type.label}</td>
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

      <CustomConfirm 
        isOpen={isOpenConfirm} 
        onCancel={handleCloseConfirm} 
        onConfirm={handleDelete} 
        message="Voulez-vous vraiment supprimer ce type d'événement ?" 
      />
    </div>
  );
});

export default EventTypeList;
