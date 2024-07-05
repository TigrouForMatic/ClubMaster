import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { dateFormat } from "../js/date";
import styles from "../styles/MatchsView.module.css";

const MatchCard = ({ match }) => (
  <div className={styles.matchCard}>
    <div className={styles.matchHeader}>
      <span className={styles.matchType}>{match.eventType}</span>
      <span className={styles.matchDate}>{dateFormat(match.dd)}</span>
    </div>
    <h3 className={styles.matchTitle}>{match.label}</h3>
    <p className={styles.matchDescription}>{match.description}</p>
    <div className={styles.matchTeams}>
      <span className={styles.homeTeam}>Équipe locale</span>
      <span className={styles.vs}>VS</span>
      <span className={styles.awayTeam}>Équipe visiteur</span>
    </div>
    <button className={styles.detailsButton}>Voir les détails</button>
  </div>
);

const useMatchData = (clubId) => {
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

function MatchsView() {
  const [clubId] = useState(1);
  const { typeEvent, event, isLoading, error } = useMatchData(clubId);

  const filteredAndSortedMatches = useMemo(() => {
    const now = new Date();
    return event
      .filter(
        (e) =>
          (e.eventtypeid === (clubId - 1) * 5 + 3 || e.eventtypeid === (clubId - 1) * 5 + 4) &&
          new Date(e.dd) >= now
      )
      .sort((a, b) => new Date(a.dd) - new Date(b.dd))
      .map(e => ({
        ...e,
        eventType: typeEvent.find(t => t.id === e.eventtypeid)?.label || 'Inconnu'
      }));
  }, [event, typeEvent, clubId]);

  if (isLoading) return <div className={styles.loading}>Chargement...</div>;
  if (error) return <div className={styles.error}>Une erreur est survenue : {error.message}</div>;

  return (
    <div className={styles.matchsContainer}>
      <h1 className={styles.matchsTitle}>Matchs à venir</h1>

      <div className={styles.matchsList}>
        {filteredAndSortedMatches.length > 0 ? (
          filteredAndSortedMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))
        ) : (
          <p className={styles.noMatches}>Aucun match prévu pour le moment.</p>
        )}
      </div>
    </div>
  );
}

export default MatchsView;