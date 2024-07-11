// NotificationContainer.js
import React from 'react';
import Notification from './Notification';
import styles from '../../styles/Notification.module.css';
import { getDisplayTimeFormat } from '../../js/date';

const NotificationContainer = ({ notifications }) => {

  return (
    <div className={styles.notificationContainer}>
      {notifications.map((notification, index) => (
        <Notification
          key={index}
          label={notification.label}
          time={ getDisplayTimeFormat(notification.time) }
        />
      ))}
    </div>
  );
};

export default NotificationContainer;