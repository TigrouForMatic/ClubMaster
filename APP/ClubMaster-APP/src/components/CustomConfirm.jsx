import React from 'react';

const CustomConfirm = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay avec animation de fondu */}
      <div className="fixed inset-0 bg-black/50 transition-opacity" />

      {/* Conteneur de la modale avec animation */}
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 sm:rounded-lg">
        {/* En-tête */}
        <div className="flex flex-col space-y-2 text-center sm:text-left">
          <h2 className="text-lg font-semibold text-zinc-900">
            Confirmation
          </h2>
          <p className="text-sm text-zinc-600">
            {message}
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomConfirm;