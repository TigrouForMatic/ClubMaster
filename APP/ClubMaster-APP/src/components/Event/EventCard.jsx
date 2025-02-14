import React from 'react';
import PropTypes from 'prop-types';

const EventCard = ({ event, isInscrit, getDateDisplay, getTimeDisplay, onClick }) => (
  <div 
    className="relative p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border-l-4"
    style={{
      borderLeftColor: isInscrit ? '#4CAF50' : '#9E9E9E',
      backgroundColor: isInscrit ? '#f1f8e9' : '#f5f5f5'
    }}
    onClick={() => onClick(event)}
  >
    <div className="absolute top-4 right-4">
      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
        isInscrit 
          ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' 
          : 'bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10'
      }`}>
        {isInscrit ? 'Inscrit' : 'Pas Inscrit'}
      </span>
    </div>

    <div className="space-y-4">
      <h3 className="text-2xl font-semibold text-center text-gray-900 mt-4">{event.label}</h3>

      <p className="text-sm font-medium text-center text-gray-600">
        Le {getDateDisplay(event.dd)} de {getTimeDisplay(event.dd)} à {getTimeDisplay(event.df)}
      </p>

      <p className="text-base text-center text-gray-700 leading-relaxed">
        {event.description}
      </p>
    </div>
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