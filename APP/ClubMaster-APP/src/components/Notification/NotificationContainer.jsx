import React from 'react';
import Notification from './Notification';
import styles from '../../styles/Notification.module.css';
import { getDisplayTimeFormat } from '../../js/date';
import useStore from '../../store/store';

const NotificationContainer = () => {
  const deleteItem = useStore((state) => state.deleteItem);
  const notifications = useStore((state) => state.notifications);

  const handleDeleteNotification = (index) => {
    deleteItem('notifications', index);
  };

  return (
    <div className={styles.notificationContainer}>
      {notifications.map((notification, index) => (
        <Notification
          key={index}
          label={notification.label}
          time={notification.time ? getDisplayTimeFormat(notification.time) : ''}
          handleDeleteNotification={() => handleDeleteNotification(notification.id)}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;
