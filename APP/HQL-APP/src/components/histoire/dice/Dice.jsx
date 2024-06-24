import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import './Dice.css';

import DiceImage1 from "./images/Dice1Trans.png";
import DiceImage2 from "./images/Dice2Trans.png";
import DiceImage3 from "./images/Dice3Trans.png";
import DiceImage4 from "./images/Dice4Trans.png";
import DiceImage5 from "./images/Dice5Trans.png";
import DiceImage6 from "./images/Dice6Trans.png";

const Dice = forwardRef(({ nombreDice, pageCreation, onDiceValues, width = "100px", stats }, ref) => {
  const diceImages = [
    DiceImage1,
    DiceImage2,
    DiceImage3,
    DiceImage4,
    DiceImage5,
    DiceImage6
  ];

  const [images, setImages] = useState([]);
  const [latestValues, setLatestValues] = useState([]);

  const rollDice = () => {
    let intervalId;
    if (pageCreation) {
      intervalId = setInterval(() => {
        const randomValues = Array.from({ length: nombreDice }, () => {
          return Math.floor(Math.random() * 6) + 1;
        });
        setImages(randomValues.map(value => diceImages[value - 1]));
        setLatestValues(randomValues); // Mise à jour des dernières valeurs des dés
      }, 100);

      // Arrêt de l'intervalle après 2 secondes
      setTimeout(() => {
        clearInterval(intervalId);
      }, 2000);
    }
  };

  useEffect(() => {
    if (latestValues.length > 0 && onDiceValues) {
      // Envoi de la dernière valeur au composant parent après 2 secondes
      const timeoutId = setTimeout(() => {
        onDiceValues(latestValues);
      }, 150);

      return () => clearTimeout(timeoutId); // Nettoyage du timeout
    }
  }, [latestValues, onDiceValues]);

  useImperativeHandle(ref, () => ({
    rollDice: rollDice
  }), []);

  return (
    <div>
      <div>
        <center>
          {pageCreation && (
            <div>
              <div className='blockDice'>
                <p>Habilité</p>
                {Array.isArray(images) && images.length > 0 && (
                  <img key={0} className='square' src={images[0]} alt={`Dice 1`} />
                )}
                <p> + 6 = {stats.maxHabilite}</p>
              </div>
              <div className='blockDice'>
                <p>Endurance</p>
                {Array.isArray(images) && images.length > 1 && (
                  <>
                    <img key={1} className='square' src={images[1]} alt={`Dice 2`} />
                    <img key={2} className='square' src={images[2]} alt={`Dice 3`} />
                  </>
                )}
                <p> + 12 = {stats.maxEndurance}</p>
              </div>
              <div className='blockDice'>
                <p>Chance</p>
                {Array.isArray(images) && images.length > 3 && (
                  <img key={3} style={{ width: width }} src={images[3]} alt={`Dice 4`} />
                )}
                <p> + 6 = {stats.maxChance}</p>
              </div>
              
            </div>
          )}
          {!pageCreation && (
            <div>
              {images.map((imageSrc, index) => (
                <img key={index} className='square' src={imageSrc} alt={`Dice ${index + 1}`} />
              ))}
            </div>
          )}
        </center>
      </div>
    </div>
  );
});

Dice.displayName = 'Dice';

export default Dice;
