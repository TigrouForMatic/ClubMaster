import React from 'react';
import styles from '../../styles/Notification.module.css';
import { Xmark } from 'iconoir-react';

const Notification = ({ label, time, handleDeleteNotification }) => {
  return (
    <div className={styles.notificationWrapper}>
      <Xmark className={styles.iconDetail} onClick={handleDeleteNotification} />
      <div className={styles.label}>{label}</div>
      <div className={styles.time}>{time}</div>
    </div>
  );
};

export default Notification;
