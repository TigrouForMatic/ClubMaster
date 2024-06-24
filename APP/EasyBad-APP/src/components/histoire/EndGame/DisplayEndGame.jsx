import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TitleEndGame from './TitleEndGame';
import StatEndGame from './StatEndGame';
import './EndGame.css';

const DisplayEndGame = ({ joueur, section, setJoueur, handleReplay, handleEditPerso }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`http://localhost:3200/stat/${joueur.id}`);
        setStats(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    const updatePlayerStatus = async () => {
      if (section) {
        const editablePlayer = { ...joueur, isfinish: true };
        setJoueur(editablePlayer);
        await handleEditPerso();
        fetchStats();
      }
    };

    updatePlayerStatus();
  }, [section]);
  // }, [section, joueur, setJoueur, handleEditPerso]);

  return (
    <div className='blockEndGame'>
      <TitleEndGame name={joueur.nom} section={section} />
      <StatEndGame stats={stats} />
      <button className='buttonRejouer' onClick={handleReplay}>Rejouer</button>
    </div>
  );
};

export default DisplayEndGame;
