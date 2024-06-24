import React, { useState, useEffect } from 'react';
import './styleSection.css';

const Epreuve = ({ section,joueur,handleChangeSection }) => {

    const lancerDes = () => Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;


    const handleChoix = () => {
        if (lancerDes() < joueur.habilite ){
            handleChangeSection(1);

        }else{
            handleChangeSection(2);
        }

    };

    return (
        <div>
            {section && section.choix1 && <button className='buttonChoices' onClick={handleChoix}>Choix 1 : {section.choix1}</button>}
        </div>
    );
};

export default Epreuve;