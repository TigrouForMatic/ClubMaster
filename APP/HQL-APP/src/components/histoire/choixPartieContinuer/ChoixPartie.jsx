import React from 'react';
import './ChoixPartie.css';

const ChoixPartie = ({ joueurs, sections, onChoisirJoueur }) => {
  const getSectionName = (sectionId) => {
    const section = sections.find(s => s.id === sectionId);
    return section ? section.libelle : "Inconnue";
  };

  const joueursNonFinis = joueurs.filter(j => !j.isfinish);

  return (
    <div className="container">
      <h2>Choix de la Partie</h2>
      {joueursNonFinis.length === 0 ? (
        <p>Aucune partie en cours</p>
      ) : (
        <ul>
          {joueursNonFinis.map(joueur => (
            
            <li key={joueur.id} className="player-item" onClick={() => onChoisirJoueur(joueur)}>
              <div className="player-details">
                <div className="player-column">
                  <p>Nom : {joueur.nom}</p>
                  <p>Endurance : {joueur.endurance}</p>
                  <p>Chance : {joueur.chance}</p>
                </div>
                <div className="player-column">
                  <p>Habilité : {joueur.habilite}</p>
                  <p>Pièces d'or : {joueur.pieceor}</p>
                  <p>Section : {getSectionName(joueur.section)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChoixPartie;
