import React from 'react';
import styles from '../styles/ProgressBar.module.css';

const ProgressBar = ({ value, max }) => {
  const percentage = (value / max) * 100;

  return (
    <div className={styles.progressBarContainer}>
      <div 
        className={styles.progressBar} 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;