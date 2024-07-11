import React, { useState } from 'react';
import styles from '../../styles/ClubOptions.module.css';
import { ShieldSearch, PlusSquare } from 'iconoir-react';
import FindClubOption from './FindClubOption';
import CreateClubOption from './CreateClubOption';

const ClubOptions = (onAuthenticate) => {
  const [activeOption, setActiveOption] = useState('options');

  const handleClick = (option) => {
    try {
      setActiveOption(option);
    } catch (error) {
      console.error("Erreur lors de la sélection de l'option:", error);
    }
  };

  const renderContent = () => {
    switch(activeOption) {
      case 'options':
        return (
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
        );
      case 'find':
        return <FindClubOption onAuthenticate={onAuthenticate} />;
      case 'create':
        return <CreateClubOption onAuthenticate={onAuthenticate} />;
      default:
        return <div>Option non reconnue</div>;
    }
  };

  return (
    <div className={styles.clubOptions}>
      {renderContent()}
    </div>
  );
};

export default ClubOptions;