import React, { useMemo, useState, useCallback } from "react";
import useStore from '../store/store';
import styles from "../styles/MatchsView.module.css";
import MatchCard from "../components/Match/MatchCard";
import ModalInfoEvent from '../components/Modale/ModalInfoEvent';

function MatchsView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  const { events, typesEvent, userClubs, inscriptions } = useStore();
  
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
          clubLabel: userClubs.find(c => c.id === eventType.clubid)?.label || 'Inconnu',
          isInscrit: inscriptions.some(ins => ins.eventid === e.id)
        };
      });
  }, [events, typesEvent, userClubs, inscriptions]);

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
      
      <ModalInfoEvent isOpen={isModalOpen} onClose={closeModal} event={selectedEvent} />
    </div>
  );
}

export default MatchsView;