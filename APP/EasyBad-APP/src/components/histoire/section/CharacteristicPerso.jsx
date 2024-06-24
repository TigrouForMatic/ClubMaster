import React from 'react';
import cadre from '../../../assets/Cadre.png';
import './styleSection.css'

const CharacteristicPerso = ({ joueur }) => {

  return (
    <>
    <img className='imgCadrePerso' src={cadre} alt='cadre' />
        <div className='cardCharac'>
        <div>
          <p className='textPerso'><strong>{joueur.nom}</strong></p>
          <p className='textPerso'><strong>Habilite</strong> : {joueur.habilite}</p>
          <p className='textPerso'><strong>Endurance</strong> : {joueur.endurance}</p>
          <p className='textPerso'><strong>Chance</strong> : {joueur.chance}</p>
        </div>
    </div>
    </>

  );
};

export default CharacteristicPerso;
