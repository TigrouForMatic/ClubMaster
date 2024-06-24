import React from 'react';

const StatEndGame = ({ stats }) => {
  
  return (
    <div className="card">
      <h2>Statistiques</h2>
      {stats ? (
        <div>
          <p className="p">{stats.section_nombre} étapes parcourues</p>
          <p className="p">{stats.pieceOr_nombre} pièces d'or</p>
          <p className="p">{stats.combats_faits} combats effectués</p>
          <p className="p">{stats.joueur_chemin_similaire} joueur(s) ayant fait le même chemin</p>
          <p className="p">{stats.joueur_terminer} joueur(s) ayant fini le jeu</p>
          <p className="p">{stats.joueur_terminer_meme_section} joueur(s) ayant fini dans la même section</p>
          <p className="p">Vous êtes plus chanceux que : {stats.joueurChanceux} %</p>
          {stats.fastRunner && <p className="p">Vous êtes un fast runner !</p>}
        </div>
      ) : (
        <p>Chargement des statistiques...</p>
      )}
    </div>
  );
};

export default StatEndGame;

