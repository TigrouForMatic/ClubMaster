import React from 'react';
import Notification from './Notification';
import styles from '../../styles/Notification.module.css';
import { getDisplayTimeFormat } from '../../js/date';
import useStore from '../../store/store';

const NotificationContainer = () => {
  const deleteNotif = useStore((state) => state.deleteNotif);
  const notifications = useStore((state) => state.notifications);

  const handleDeleteNotification = (index) => {
    deleteNotif(index);
  };

  return (
    <div className={styles.notificationContainer}>
      {notifications.map((notification, index) => (
        <Notification
          key={index}
          label={notification.label}
          time={notification.time ? getDisplayTimeFormat(notification.time) : ''}
          handleDeleteNotification={() => handleDeleteNotification(index)}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;
