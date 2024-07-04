import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { dateFormat } from "../js/date";
import EventCard from "../components/Event/EventCard";
import styles from "../styles/HomeView.module.css";

const useEventData = (clubId) => {
    const [typeEvent, setTypeEvent] = useState([]);
    const [event, setEvent] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const [{ data: typeEventData }, { data: eventData }] = await Promise.all([
            axios.get(`http://localhost:3200/eventType?clubid=${clubId}`),
            axios.get("http://localhost:3200/event"),
          ]);
  
          setTypeEvent(typeEventData);
          setEvent(eventData);
          setIsLoading(false);
        } catch (error) {
          console.error("Erreur lors de la récupération des données :", error);
          setError(error);
          setIsLoading(false);
        }
      };
  
      fetchData();
    }, [clubId]);
  
    return { typeEvent, event, isLoading, error };
  };
  
  const EventTypeList = ({ types }) => (
    <ul>
      {types.map((type) => (
        <li key={type.id}>
          <p>Nom : {type.label}</p>
        </li>
      ))}
    </ul>
  );  

const EventList = ({ events, getDateDisplay }) => (
  <div className={styles.eventList}>
    {events.map((event) => (
      <EventCard key={event.id} event={event} getDateDisplay={getDateDisplay} />
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
};

function HomeView() {
  const { typeEvent, event, isLoading, error } = useEventData(1);

  const filteredAndSortedEvents = useMemo(() => {
    const now = new Date();
    return event
      .filter(
        (e) =>
          typeEvent.some((type) => e.eventtypeid === type.id) &&
          new Date(e.dd) >= now
      )
      .sort((a, b) => new Date(a.dd) - new Date(b.dd));
  }, [event, typeEvent]);

  const getDateDisplay = (date) => dateFormat(date);

  if (isLoading) return <div className={styles.loading}>Chargement...</div>;
  if (error) return <div className={styles.error}>Une erreur est survenue : {error.message}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Événements à venir</h1>
      <EventList events={filteredAndSortedEvents} getDateDisplay={getDateDisplay} />
    </div>
  );
}

export default HomeView;