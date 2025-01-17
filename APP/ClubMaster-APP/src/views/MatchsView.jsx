import React, { useMemo, useState, useCallback } from "react";
import useStore from '../store/store';
import styles from "../styles/MatchsView.module.css";
import MatchCard from "../components/Match/MatchCard";
import InfoEvent from '../components/Event/InfoEvent';

function MatchsView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  const { events, typesEvent, userClubs, inscriptions, matchScores, matchTeams, teamMembers } = useStore();
  
  const filteredAndSortedMatches = useMemo(() => {
    if (!events || !typesEvent || !userClubs || !matchScores || !matchTeams) return [];
    const now = new Date();
    
    return events
      .filter(e => 
        (matchScores.some(s => s.eventid === e.id) ||
          matchTeams.some(t => t.eventid === e.id))
        )
      .sort((a, b) => new Date(a.dd) - new Date(b.dd))
      .map(e => {
        const eventType = typesEvent.find(t => t.id === e.eventtypeid);
        if (!eventType) return null;
        
        return {
          ...e,
          eventType: eventType?.label || 'Inconnu',
          clubLabel: userClubs.find(c => c.id === eventType.clubid)?.label || 'Inconnu',
          isInscrit: inscriptions.some(ins => ins.eventid === e.id),
          matchScores: matchScores.filter(s => s.eventid === e.id),
          matchTeams: matchTeams.filter(t => t.eventid === e.id)
        };
      })
      .filter(Boolean);
  }, [events, typesEvent, userClubs, inscriptions, matchScores, matchTeams, teamMembers]);

  const handleEventClick = useCallback((event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  }, []);

  return (
    <div className={styles.matchsContainer}>
      <h1 className={styles.matchsTitle}>Matchs à venir</h1>
      
      <div className={styles.matchsList}>
        {filteredAndSortedMatches.length > 0 ? (
          filteredAndSortedMatches.map((match) => (
            <MatchCard key={match.id} match={match} onDetailClick={() => handleEventClick(match)} />
          ))
        ) : (
          <p className={styles.noMatches}>Aucun match prévu pour le moment.</p>
        )}
      </div>
      
      {selectedEvent && (
        <InfoEvent isOpen={isModalOpen} onClose={closeModal} eventId={selectedEvent.id} />
      )}
    </div>
  );
}

export default MatchsView;