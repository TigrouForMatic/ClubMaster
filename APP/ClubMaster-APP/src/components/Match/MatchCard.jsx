import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { dateFormat } from "../../js/date";
import { getColorFromString } from '../../js/color';
import styles from '../../styles/MatchCard.module.css';
import UserImage from '../UserImage';

const MatchCard = ({ match, onDetailClick }) => {
  const clubColor = getColorFromString(match.clubLabel);
  const cardClassName = `${styles.matchCard} ${match.isInscrit ? styles.inscrit : styles.pasInscrit}`;

  useEffect(() => {
    console.log(match);
    console.log(inProgress);
  }, [match]);

  const nameReturn = (user) => {
    if (user.pseudo) {
      return user.pseudo;
    } else {
      return user.name;
    }
  }
  const inProgress = (new Date(match.dd).getTime() < (new Date().getTime()-3600000) && new Date(match.df).getTime() > (new Date().getTime()-3600000));

  return (
    <div className={cardClassName}>
      <div className={styles.matchHeader}>
        <div className={styles.typeAndClub}>
          <span className={styles.matchType}>{match.eventType}</span>
          <span className={styles.clubLabel} style={{ backgroundColor: clubColor }}>
            {match.clubLabel}
          </span>
        </div>
        {inProgress && <span className={styles.matchDate}>En cours</span>}
        <span className={styles.matchDate}>{dateFormat(match.dd)}</span>
      </div>
      <h3 className={styles.matchTitle}>{match.label}</h3>
      <p className={styles.matchDescription}>{match.description}</p>
      <div className={styles.matchTeams}>
        <div>
          <span className={styles.homeTeam}>{match.matchTeams[0].teamLabel || 'Équipe locale'}</span>
          <div className={styles.listTeamMember}>
            {match.matchTeams[0].teamMembers.map((member) => (
              <div key={member.id} className={styles.homeTeamMember}>
                <UserImage name={nameReturn(member)} size={20} />
                <span className={styles.homeTeamName}>{nameReturn(member)}</span>
              </div>
            ))}
          </div>
        </div>
        <span className={styles.vs}>VS</span>
        <div>
          <span className={styles.awayTeam}>{match.matchTeams[1].teamLabel || 'Équipe visiteur'}</span>
          <div className={styles.listTeamMember}>
            {match.matchTeams[1].teamMembers.map((member) => (
              <div key={member.id} className={styles.awayTeamMember}>
                <span className={styles.awayTeamName}>{nameReturn(member)}</span>
                <UserImage name={nameReturn(member)} size={20} />
              </div>
            ))}
          </div>
        </div>
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