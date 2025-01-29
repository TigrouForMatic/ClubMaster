import React from 'react';
import PropTypes from 'prop-types';

const EventCard = ({ event, isInscrit, getDateDisplay, getTimeDisplay, onClick }) => (
  <div 
    className="relative p-6 bg-card text-card-foreground rounded-lg shadow-md transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer"
    onClick={() => onClick(event)}
  >
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-2xl font-semibold">{event.label}</h3>
      {isInscrit ? (
        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
          Inscrit
        </span>
      ) : (
        <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
          Pas Inscrit
        </span>
      )}
    </div>

    <p className="text-sm text-muted-foreground mb-4">
      Le {getDateDisplay(event.dd)} de {getTimeDisplay(event.dd)} à {getTimeDisplay(event.df)}
    </p>

    <p className="text-sm text-card-foreground">
      {event.description}
    </p>
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
  isInscrit: PropTypes.bool.isRequired,
  getDateDisplay: PropTypes.func.isRequired,
  getTimeDisplay: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default React.memo(EventCard);