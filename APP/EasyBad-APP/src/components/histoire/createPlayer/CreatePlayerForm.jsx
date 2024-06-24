import React, { useState, useRef } from 'react';
import './CreatePlayerForm.css';
import PotionChance from '../../../assets/PotionChance.svg'; 
import PotionEndurance from '../../../assets/PotionEndurance.svg';
import PotionHabilité from '../../../assets/PotionHabilité.svg';
import Dice from '../dice/Dice.jsx';

const CreatePlayerForm = ({ onCreatePlayer }) => {
  const [playerName, setPlayerName] = useState('');
  const [stats, setStats] = useState({
    maxHabilite: 0,
    maxEndurance: 0,
    maxChance: 0
  });
  const [potionType, setPotionType] = useState('');
  const diceRef = useRef(null);
  let desLancers = false;

  const handleChangeName = (e) => {
    setPlayerName(e.target.value);
  };

  const handleRollStats = () => {
    if (diceRef.current) {
      diceRef.current.rollDice();
      desLancers = true;
    }
  };

  const handleReceiveDiceValues = (values) => {
    if (values.length === 4) { 
      setStats({
        maxHabilite: values[0] + 6, 
        maxEndurance: values[1] + values[2] + 12, 
        maxChance: values[3] + 6
      });
    }
  };

  const handleChoosePotion = (type) => {
    setPotionType(type);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onCreatePlayer(playerName, stats.maxHabilite, stats.maxHabilite, stats.maxEndurance, stats.maxEndurance,  stats.maxChance,  stats.maxChance, potionType)
  };  

  return (
    <div className="create-player-form">
      <h2>Créer un joueur</h2>
      <form onSubmit={handleSubmit}>
        <label>Nom du joueur :</label>
        <input type="text" value={playerName} onChange={handleChangeName} required maxLength={49}/>
        <br />
        <button type="button" onClick={handleRollStats}>Lancer les dés pour les stats</button>
        <div className="stats-container">
          <p>Stats:</p>
        <div className='dice'>
          <Dice ref={diceRef} nombreDice={4} pageCreation={true} desLancers={desLancers} onDiceValues={handleReceiveDiceValues} stats={stats} /> {/* Passage de la prop pageCreation */}
        </div>
        </div>
        <label>Choisir une potion:</label>
        <div className="potion-options">
          <input
            type="radio"
            value="PotionChance"
            checked={potionType === 'PotionChance'}
            onChange={() => handleChoosePotion('PotionChance')}
          />
          <img
            src={PotionChance}
            alt="Potion de Chance"
            onClick={() => handleChoosePotion('PotionChance')}
            className={potionType === 'PotionChance' ? 'selected' : ''}
          />
          <input
            type="radio"
            value="PotionEndurance"
            checked={potionType === 'PotionEndurance'}
            onChange={() => handleChoosePotion('PotionEndurance')}
          />
          <img
            src={PotionEndurance}
            alt="Potion d'Endurance"
            onClick={() => handleChoosePotion('PotionEndurance')}
            className={potionType === 'PotionEndurance' ? 'selected' : ''}
          />
          <input
            type="radio"
            value="PotionHabilité"
            checked={potionType === 'PotionHabilité'}
            onChange={() => handleChoosePotion('PotionHabilité')}
          />
          <img
            src={PotionHabilité}
            alt="Potion d'Habilité"
            onClick={() => handleChoosePotion('PotionHabilité')}
            className={potionType === 'PotionHabilité' ? 'selected' : ''}
          />
        </div>
        <br />
        <button type="submit">Commencer la partie</button>
      </form>
    </div>
  );
};

export default CreatePlayerForm;
