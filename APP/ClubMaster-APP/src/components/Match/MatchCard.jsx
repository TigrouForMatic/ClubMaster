import React from 'react';
import { dateFormat } from "../../js/date";
import { getColorFromString } from '../../js/color';
import styles from '../../styles/MatchCard.module.css';

const MatchCard = ({ match }) => {
    const clubColor = getColorFromString(match.clubLabel);
    
    return (
      <div className={styles.matchCard}>
        <div className={styles.matchHeader}>
          <span className={styles.matchType}>{match.eventType}</span>
          <span className={styles.clubLabel} style={{ backgroundColor: clubColor }}>
            {match.clubLabel}
          </span>
          <span className={styles.matchDate}>{dateFormat(match.dd)}</span>
        </div>
        <h3 className={styles.matchTitle}>{match.label}</h3>
        <p className={styles.matchDescription}>{match.description}</p>
        <div className={styles.matchTeams}>
          <span className={styles.homeTeam}>{match.homeTeam || 'Équipe locale'}</span>
          <span className={styles.vs}>VS</span>
          <span className={styles.awayTeam}>{match.awayTeam || 'Équipe visiteur'}</span>
        </div>
        <button className={styles.detailsButton}>Voir les détails</button>
      </div>
    );
  };

export default MatchCard;
