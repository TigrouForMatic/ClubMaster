import React from 'react';
import PropTypes from 'prop-types';
import { dateFormat } from "../../js/date";
import { getColorFromString } from '../../js/color';
import styles from '../../styles/MatchCard.module.css';

const MatchCard = ({ match, onDetailClick }) => {
  const clubColor = getColorFromString(match.clubLabel);
  const cardClassName = `${styles.matchCard} ${match.isInscrit ? styles.inscrit : styles.pasInscrit}`;
  
  return (
    <div className={cardClassName}>
      <div className={styles.matchHeader}>
        <div className={styles.typeAndClub}>
          <span className={styles.matchType}>{match.eventType}</span>
          <span className={styles.clubLabel} style={{ backgroundColor: clubColor }}>
            {match.clubLabel}
          </span>
        </div>
        <span className={styles.matchDate}>{dateFormat(match.dd)}</span>
      </div>
      <h3 className={styles.matchTitle}>{match.label}</h3>
      <p className={styles.matchDescription}>{match.description}</p>
      <div className={styles.matchTeams}>
        <span className={styles.homeTeam}>{match.homeTeam || 'Équipe locale'}</span>
        <span className={styles.vs}>VS</span>
        <span className={styles.awayTeam}>{match.awayTeam || 'Équipe visiteur'}</span>
      </div>
      <div className={styles.cardFooter}>
        <div className={styles.buttonWrapper}>
          <button className={styles.detailsButton} onClick={() => onDetailClick()}>
            Afficher les détails
          </button>
        </div>
        <div className={`${styles.inscriptionStatus} ${match.isInscrit ? styles.inscritStatus : styles.pasInscritStatus}`}>
          {match.isInscrit ? 'Inscrit' : 'Non inscrit'}
        </div>
      </div>
    </div>
  );
};

MatchCard.propTypes = {
  match: PropTypes.shape({
    eventType: PropTypes.string.isRequired,
    clubLabel: PropTypes.string.isRequired,
    dd: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    homeTeam: PropTypes.string,
    awayTeam: PropTypes.string,
    isInscrit: PropTypes.bool.isRequired,
  }).isRequired,
  onDetailClick: PropTypes.func.isRequired,
};

export default React.memo(MatchCard);