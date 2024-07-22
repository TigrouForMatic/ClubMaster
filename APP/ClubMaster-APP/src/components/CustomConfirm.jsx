import React from 'react';
import styles from '../styles/CustomConfirm.module.css'

const CustomConfirm = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.customConfirmOverlay}>
      <div className={styles.customConfirmModal}>
        <p>{message}</p>
        <div className={styles.customConfirmButtons}>
          <button onClick={onConfirm}>Confirmer</button>
          <button onClick={onCancel}>Annuler</button>
        </div>
      </div>
    </div>
  );
};

export default CustomConfirm;