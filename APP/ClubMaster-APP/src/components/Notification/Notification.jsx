// Notification.js
import React from 'react';
import styles from '../../styles/Notification.module.css';

const Notification = ({ label, time }) => {
  return (
    <div className={styles.notificationWrapper}>
      <div className={styles.label}>{label}</div>
      <div className={styles.time}>{time}</div>
    </div>
  );
};

export default Notification;