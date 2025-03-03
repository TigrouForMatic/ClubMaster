import React from 'react';
import FindClubOption from '../ClubOptions/FindClubOption';

const ModalFindClub = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed -inset-10 bg-black/50 z-50 flex items-center justify-center" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="bg-white rounded-lg shadow-lg w-full min-h-[80%] max-h-[80%] min-w-[47%] max-w-[47%] mx-4 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <FindClubOption />
      </div>
    </div>
  );
};

export default ModalFindClub;