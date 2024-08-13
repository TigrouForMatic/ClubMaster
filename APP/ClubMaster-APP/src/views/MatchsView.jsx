import React, { useMemo, useEffect } from "react";
import useStore from '../store/store';
import styles from "../styles/MatchsView.module.css";
import MatchCard from "../components/Match/MatchCard";

function MatchsView() {
  const { events, typesEvent, userClubs } = useStore();

  useEffect(() => {
    console.log(userClubs)
  }, [userClubs]);

  const filteredAndSortedMatches = useMemo(() => {
    const now = new Date();
    const matchTypes = typesEvent.filter(t => t.ismatch);
    
    return events
      .filter(e => 
        matchTypes.some(t => t.id === e.eventtypeid) &&
        new Date(e.dd) >= now
      )
      .sort((a, b) => new Date(a.dd) - new Date(b.dd))
      .map(e => {
        const eventType = typesEvent.find(t => t.id === e.eventtypeid);
        return {
          ...e,
          eventType: eventType?.label || 'Inconnu',
          clubLabel: userClubs.find(c => c.id === e.clubid)?.label || 'Inconnu'
        };
      });
  }, [events, typesEvent, userClubs]);

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