import React from 'react';
import '../../styles/ClubOptions.module.css';

const ClubOptions = () => {
  return (
    <div className="club-options">
      <div className="club-options-container">
        <button className="club-option">Trouver un club</button>
        <button className="club-option">Créer un club</button>
      </div>
    </div>
  );
};

export default ClubOptions;