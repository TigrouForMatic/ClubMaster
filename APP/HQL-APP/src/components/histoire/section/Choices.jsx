import React from 'react';
import './styleSection.css';

const Choices = ({ section, handleChangeSection }) => {
  return (
    <div className='cardChoices'>

        {section && section.choix1 && <button className='buttonChoices' onClick={() => handleChangeSection(1)}>Choix 1 : {section.choix1}</button>}
        {section && section.choix2 && <button className='buttonChoices' onClick={() => handleChangeSection(2)}>Choix 2 : {section.choix2}</button>}
        {section && section.choix3 && <button className='buttonChoices' onClick={() => handleChangeSection(3)}>Choix 3 : {section.choix3}</button>}
    </div>
  );
};

export default Choices;
