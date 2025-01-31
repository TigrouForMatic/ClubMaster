import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { dateFormat } from "../../js/date";
import { getColorFromString } from '../../js/color';
import UserImage from '../UserImage';

const MatchCard = ({ match, onDetailClick }) => {
  const clubColor = getColorFromString(match.clubLabel);
  
  useEffect(() => {
    console.log(match);
    console.log(inProgress);
  }, [match]);

  const nameReturn = (user) => {
    return user.pseudo || user.name;
  }

  const inProgress = (new Date(match.dd).getTime() < (new Date().getTime()-3600000) && 
                     new Date(match.df).getTime() > (new Date().getTime()-3600000));

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg 
                    hover:-translate-y-1 ${match.isInscrit ? 'border-l-4 border-green-500' : 'border-l-4 border-gray-400'}`}>
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-1">
          <span className="text-sm font-medium text-gray-600">{match.eventType}</span>
          <span className="ml-2 px-2 py-1 text-xs rounded-full text-white" 
                style={{ backgroundColor: clubColor }}>
            {match.clubLabel}
          </span>
        </div>
        <div className="text-right">
          {inProgress && 
            <span className="text-green-500 font-semibold text-sm mb-1 block">En cours</span>
          }
          <span className="text-gray-500 text-sm">{dateFormat(match.dd)}</span>
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2">{match.label}</h3>
      <p className="text-gray-600 mb-4 text-sm">{match.description}</p>

      <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center mb-6">
        <div>
          <span className="font-medium text-gray-900 block mb-2">
            {match.matchTeams?.[0]?.label || 'Équipe locale'}
          </span>
          <div className="space-y-2">
            {match.matchTeams?.[0]?.members?.map((member) => (
              <div key={member.id} className="flex items-center gap-2">
                <UserImage name={nameReturn(member)} size={24} />
                <span className="text-sm text-gray-700">{nameReturn(member)}</span>
              </div>
            ))}
          </div>
        </div>

        <span className="text-gray-400 font-bold">VS</span>

        <div className="text-right">
          <span className="font-medium text-gray-900 block mb-2">
            {match.matchTeams?.[1]?.label || 'Équipe visiteur'}
          </span>
          <div className="space-y-2">
            {match.matchTeams?.[1]?.members?.map((member) => (
              <div key={member.id} className="flex items-center justify-end gap-2">
                <span className="text-sm text-gray-700">{nameReturn(member)}</span>
                <UserImage name={nameReturn(member)} size={24} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button onClick={onDetailClick}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 
                         rounded-md transition-colors duration-200">
          Afficher les détails
        </button>
        <div className="text-center">
          <span className={`inline-flex items-center text-sm font-medium
                        ${match.isInscrit ? 'text-green-600' : 'text-gray-600'}`}>
            {match.isInscrit ? '✓ Inscrit' : 'Non inscrit'}
          </span>
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
    df: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    matchTeams: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        teamMembers: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string,
            pseudo: PropTypes.string
          })
        ).isRequired
      })
    ).isRequired,
    isInscrit: PropTypes.bool.isRequired,
  }).isRequired,
  onDetailClick: PropTypes.func.isRequired,
};

export default React.memo(MatchCard);