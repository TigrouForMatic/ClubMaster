import React, { useState } from 'react';
import styles from '../../styles/ClubOptions.module.css';
import { ShieldSearch, PlusSquare } from 'iconoir-react';
import FindClubOption from './FindClubOption';
import CreateClubOption from './CreateClubOption';

const ClubOptions = () => {
  const [activeOption, setActiveOption] = useState('options');

  const handleClick = (option) => {
    setActiveOption(option);
    console.log(`Option sélectionnée : ${option}`);
  };

  return (
    <div className={styles.clubOptions}>
      {activeOption === 'options' && (
        <div className={styles.clubOptionsContainer}>
          <button 
            className={styles.clubOption} 
            onClick={() => handleClick('find')}
          >
            <ShieldSearch className={styles.iconDetail} />
            Trouver un club
          </button>
          <button 
            className={styles.clubOption} 
            onClick={() => handleClick('create')}
          >
            <PlusSquare className={styles.iconDetail} />
            Créer un club
          </button>
        </div>
      )}

      {activeOption === 'find' && <FindClubOption />}
      {activeOption === 'create' && <CreateClubOption />}
    </div>
  );
};

export default ClubOptions;