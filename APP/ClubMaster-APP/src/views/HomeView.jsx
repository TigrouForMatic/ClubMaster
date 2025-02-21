import React, { useState, useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import EventCard from "../components/Event/EventCard";
import useStore from '../store/store';
import { dateFormat, dateToTimeFormat } from "../js/date";
import InfoEvent from '../components/Event/InfoEvent';
import CarouselInfoBanner from '../components/InfoBanner/CarouselInfoBanner';

const MainEventCard = ({ event, getDateDisplay, getTimeDisplay, addresses, onClick, isInscrit }) => {
  const address = addresses.find(a => a.id === event.addressid);
  
  return (
    <div 
      className="relative p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border-l-4 mb-6"
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
        <h2 className="text-2xl font-semibold text-center text-gray-900 mt-4">
          {event.label}
        </h2>

        <p className="text-sm font-medium text-center text-gray-600">
          Le {getDateDisplay(event.dd)} de {getTimeDisplay(new Date(new Date(event.dd).getTime() - 3600000))} à {getTimeDisplay(new Date(new Date(event.df).getTime() - 3600000))}
        </p>

        <p className="text-base text-center text-gray-700 leading-relaxed">
          {event.description}
        </p>

        {address && (
          <div className="flex items-center justify-center text-sm text-gray-500 mt-4">
            <svg 
              className="w-4 h-4 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>
              {address.street}, {address.postalcode} {address.city}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const EventList = ({ events, getDateDisplay, getTimeDisplay, inscriptions, onEventClick }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {events.map((event) => (
      <EventCard 
        key={event.id} 
        event={event} 
        isInscrit={inscriptions.some(ins => ins.eventid === event.id)}
        getDateDisplay={getDateDisplay} 
        getTimeDisplay={getTimeDisplay} 
        onClick={() => onEventClick(event)}
      />
    ))}
  </div>
);

EventList.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      dd: PropTypes.string.isRequired,
      df: PropTypes.string.isRequired,
    })
  ).isRequired,
  getDateDisplay: PropTypes.func.isRequired,
  getTimeDisplay: PropTypes.func.isRequired,
  inscriptions: PropTypes.array.isRequired,
  onEventClick: PropTypes.func.isRequired,
};

function HomeView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { events, typesEvent, addresses, inscriptions } = useStore();

  const filteredAndSortedEvents = useMemo(() => {
    const now = new Date();
    return events
      .filter(
        (e) =>
          typesEvent.some((type) => e.eventtypeid === type.id) &&
          new Date(e.dd) >= now
      )
      .sort((a, b) => new Date(a.dd) - new Date(b.dd));
  }, [events, typesEvent]);

  const getDateDisplay = useCallback((date) => dateFormat(date), []);
  const getTimeDisplay = useCallback((date) => dateToTimeFormat(date), []);

  const handleEventClick = useCallback((event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  }, []);

  const nextEvent = filteredAndSortedEvents[0];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl pb-24">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8">
        Événements à venir
      </h1>

      <CarouselInfoBanner />

      {nextEvent && (
        <div className="w-full max-w-6xl mx-auto px-4 pt-6">
          <MainEventCard 
            event={nextEvent}
            getDateDisplay={getDateDisplay}
            getTimeDisplay={getTimeDisplay}
            addresses={addresses}
            onClick={handleEventClick}
            isInscrit={inscriptions.some(ins => ins.eventid === nextEvent.id)}
          />
        </div>
      )}

      <div className="w-full max-w-6xl mx-auto px-4">
        <EventList 
          events={filteredAndSortedEvents.slice(1)}
          getDateDisplay={getDateDisplay}
          getTimeDisplay={getTimeDisplay}
          inscriptions={inscriptions}
          onEventClick={handleEventClick}
        />
      </div>

      {selectedEvent && (
        <InfoEvent 
          isOpen={isModalOpen} 
          onClose={closeModal} 
          eventId={selectedEvent.id} 
        />
      )}
    </div>
  );
}

export default HomeView;