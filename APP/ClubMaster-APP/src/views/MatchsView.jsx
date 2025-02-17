import React, { useMemo, useState, useCallback } from "react";
import useStore from '../store/store';
import MatchCard from "../components/Match/MatchCard";
import InfoEvent from '../components/Event/InfoEvent';

function MatchsView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  const { events, typesEvent, userClubs, inscriptions, matchScores, matchTeams, teamMembers } = useStore();
  
  const filteredAndSortedMatches = useMemo(() => {
    if (!events || !typesEvent || !userClubs || !matchScores || !matchTeams) return [];
    const now = new Date();

    
    const matchs = events.filter(e => e.ismatch)
    console.log(matchs)
    
    return matchs
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
    <div className="container mx-auto px-4 py-8 max-w-7xl pb-24">
      <div className="space-y-8">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
            Matchs à venir
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl text-center">
            Suivez tous les matchs de vos équipes et restez informé des résultats
          </p>
        </div>

        <div className="w-full max-w-6xl mx-auto">
          {filteredAndSortedMatches.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredAndSortedMatches.map((match) => (
                <MatchCard 
                  key={match.id} 
                  match={match} 
                  onDetailClick={() => handleEventClick(match)} 
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  Aucun match prévu
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Il n'y a pas de matchs programmés pour le moment.
                </p>
              </div>
            </div>
          )}
        </div>
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

export default MatchsView;