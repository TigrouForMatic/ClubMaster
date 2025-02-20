import React, { useState, useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import EventCard from "../components/Event/EventCard";
import useStore from '../store/store';
import api from '../js/App/Api';
import { dateFormat, dateToTimeFormat } from "../js/date";
import InfoEvent from '../components/Event/InfoEvent';
import CarouselInfoBanner from '../components/InfoBanner/CarouselInfoBanner';

const useEventData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userClubs, currentUser, lastFetchTime, setItems } = useStore();

  useEffect(() => {
    const fetchData = async () => {

       // Vérifiez si les données ont été récupérées récemment (par exemple, dans les 20 dernières minutes)
       const now = Date.now();
       const minBeforeData = 20 * 60 * 1000;
       if (lastFetchTime && now - lastFetchTime < minBeforeData) {
         setIsLoading(false);
         return;
       }

      try {
        setIsLoading(true);
        const arrayClubId = userClubs.map(club => club.id);

        const typeEventData = await api.get("/eventType", { params: { arrayClubId: JSON.stringify(arrayClubId)} });
        setItems('typesEvent', typeEventData);

        const teamData = await api.get("/team", { params: { arrayClubId: JSON.stringify(arrayClubId)} });
        setItems('teams', teamData);

        const photosData = await api.get("/photos", { params: { arrayClubId: JSON.stringify(arrayClubId)} });
        setItems('photos', photosData);

        const infoBannerData = await api.get("/infoBanner", { params: { arrayClubId: JSON.stringify(arrayClubId)} });
        setItems('infoBanners', infoBannerData);

        const arrayEventTypeId = typeEventData.map(type => type.id);
        const eventData = await api.get("/event", { params: { arrayEventTypeId: JSON.stringify(arrayEventTypeId) } });
        setItems('events', eventData);

        const matchTeamData = await api.get("/matchTeam", { params: { arrayTeamId: JSON.stringify(teamData.map(team => team.id)) } });
        setItems('matchTeams', matchTeamData);

        const matchScoreData = await api.get("/matchScore", { params: { arrayMatchTeamId: JSON.stringify(matchTeamData.map(matchTeam => matchTeam.id)) } });
        setItems('matchScores', matchScoreData);

        const arrayEventId = eventData.map(evnt => evnt.id);
        const inscriptionData = await api.get("/inscription", { params: { arrayEventId: JSON.stringify(arrayEventId), personPhysicId : currentUser.id } });
        setItems('inscriptions', inscriptionData);
        
        const addressData = await api.get("/address");
        setItems('addresses', addressData);

        const licenceData = await api.get("/licence", { params: { personphysicid: currentUser.id } });
        setItems('licences', licenceData);

        const typeLicencesData = await api.get("/licenceType", { params: { arrayClubId: JSON.stringify(arrayClubId)} });
        setItems('licenceTypes', typeLicencesData);

        const roleData = await api.get("/role", { params: { arrayClubId: JSON.stringify(arrayClubId)} });
        setItems('roles', roleData);

        const userRoles = roleData.filter(role => licenceData.some(lic => lic.roleid === role.id));
        setItems('currentUserRoles', userRoles);

        // Mettez à jour le temps de la dernière récupération
        useStore.setState({ lastFetchTime: now });

        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        setError(error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [userClubs, currentUser, setItems]);

  return { isLoading, error };
};

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

  const { isLoading, error } = useEventData();
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

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-lg text-gray-600">Chargement...</div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-lg text-red-600">Une erreur est survenue : {error.message}</div>
    </div>
  );

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