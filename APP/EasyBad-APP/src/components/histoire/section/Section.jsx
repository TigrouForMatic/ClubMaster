import React, {useEffect} from 'react';
import Inventory from './Inventory';
import CharacteristicPerso from './CharacteristicPerso';
import Choices from './Choices';
import SectionDescritpionQuestion from './SectionDescriptionQuestion';
import Combat from './Combat';
import Question from './Question';
import Marchand from './Marchand';
import Epreuve from './Epreuve';
import DisplayEndGame from '../EndGame/DisplayEndGame';
import './styleSection.css';

const Section = ({ joueur, section, monstres, handleChangeSection, setJoueur, handleReplay, potionUsed, setPotionUsed, handleEditPerso }) => {

  const getMonstreById = (id) => {
    return monstres.find(monstre => monstre.id === id);
  };

  const getComponentByType = () => {
    switch (section.type) {
      case 3:
        return <Combat section={section} joueur={joueur} monstre={getMonstreById(section.idmonstre)} fuitePossible={true} handleChangeSection={handleChangeSection} setJoueur={setJoueur}/>;
      case 4:
        return <Choices section={section} handleChangeSection={handleChangeSection}/>;
      case 5:
        return <Epreuve section={section} joueur={joueur} handleChangeSection={handleChangeSection} />;
      case 6:
        return <Question section={section} degreErreur={3} onResultat={handleChangeSection} />;
      case 7:
        return <Marchand section={section} joueur={joueur} handleChangeSection={handleChangeSection} />;
      default:
        return <Choices section={section} handleChangeSection={handleChangeSection} />;
    }
  };

  const handleLeave = () => {
    if (window.confirm("Etes-vous sûr de vouloir quitter la partie maintenant ? ")) {
      const editablePlayer = { ...joueur };
      editablePlayer.isfinish = false;
      setJoueur(editablePlayer);
      handleReplay();
    }
  };

  const handlePotionEffect = (potion) => {
    let updatedJoueur = { ...joueur};
    switch (potion) {
      case "Endurance":
        updatedJoueur.endurance = joueur.maxendurance;
        break;
      case "Chance":
        updatedJoueur.chance = joueur.maxchance;
        break;
      case "Habilité":
        updatedJoueur.habilite = joueur.maxhabilite;
        break;
      default:
        break;
    }

    setJoueur(updatedJoueur);
    setPotionUsed(true);
  };

  return (
    <div className='divSection'>

      {section.type > 2 &&
        <div>
          <CharacteristicPerso joueur={joueur} />
          <Inventory joueur={joueur} potionUsed={potionUsed} handlePotionEffect={handlePotionEffect} />
          
          <h1 className='titreSection'>{section.libelle}</h1>

          {getComponentByType()}
          <SectionDescritpionQuestion section={section} />
        </div>
      }

      {section.type <= 2 &&
          <DisplayEndGame joueur={joueur} section={section} setJoueur={setJoueur} handleReplay={handleReplay} handleEditPerso={handleEditPerso} />
      }

      {section.type > 2 && (
        <div style={{ 
          position: 'absolute', 
          bottom: '20px', 
          right: '20px',
        }}>
          <button className='ButtonQuitter' onClick={() => handleLeave()}>Quitter</button>
        </div>
      )}
    </div>
  );
};

export default Section;
