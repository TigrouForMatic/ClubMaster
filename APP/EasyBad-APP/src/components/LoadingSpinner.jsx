import React from 'react';
import '../styles/loadingSpinnerStyles.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner"></div>
      <p>Chargement en cours...</p>
    </div>
  );
};

export default LoadingSpinner;