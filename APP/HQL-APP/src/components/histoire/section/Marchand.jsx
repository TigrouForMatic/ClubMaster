import React from 'react';
import './styleSection.css';

const Marchand = ({ section,joueur,handleChangeSection }) => {

    const extractNumber = (str) => {
        const match = str.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
    };

    const handleChoix1Click = () => {
        if (joueur.pieceOr - extractNumber(section.choix1) >=0) {
            joueur.pieceOr -= extractNumber(section.choix1)
        }
        handleChangeSection(1);
    };

    const handleChoix2Click = () => {
        if (joueur.pieceOr - extractNumber(section.choix2) >=0) {
            joueur.pieceOr -= extractNumber(section.choix2)
        }
        handleChangeSection(2);
    };

    const handleChoix3Click = () => {
        handleChangeSection(3);
    };

    return (
        <div>
            {section && section.choix1 && <button className='buttonChoices' onClick={handleChoix1Click}>Choix 1 : {section.choix1}</button>}
            {section && section.choix2 && <button className='buttonChoices' onClick={handleChoix2Click}>Choix 2 : {section.choix2}</button>}
            {section && section.choix3 && <button className='buttonChoices' onClick={handleChoix3Click}>Choix 3 : {section.choix3}</button>}
        </div>
    );
};

export default Marchand;