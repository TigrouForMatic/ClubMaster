import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/EventCard.module.css';

const EventCard = ({ event, getDateDisplay }) => (
  <div className={styles.card}>
    <h3 className={styles.title}>{event.label}</h3>
    <p className={styles.date}>
      Du {getDateDisplay(event.dd)} au {getDateDisplay(event.df)}
    </p>
    <p className={styles.description}>{event.description}</p>
  </div>
);

EventCard.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    dd: PropTypes.string.isRequired,
    df: PropTypes.string.isRequired,
  }).isRequired,
  getDateDisplay: PropTypes.func.isRequired,
};

export default EventCard;