import React, { useState, useEffect } from "react";
import axios from "axios";
import CreatePlayerForm from "./createPlayer/CreatePlayerForm";
import Section from "./section/Section";
import Credits from "./Credits";
import Statistique from "./Statistique";
import ChoixPartie from './choixPartieContinuer/ChoixPartie';
import BackgroundMusic from './backgroundMusic/BackgroundMusic';
import { MdExitToApp, MdMusicNote, MdMusicOff, MdEco } from 'react-icons/md';

import './Histoire.css';
// import DataModal from './components/dev/DataModal';

function MainQuestComponent() {
  const [joueur, setJoueur] = useState(null);
  const [section, setSection] = useState(null);
  const [monstres, setMonstres] = useState([]);
  const [bonus, setBonus] = useState([]);
  const [joueurs, setJoueurs] = useState([]);
  const [typeSections, setTypeSections] = useState([]);
  const [sections, setSections] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showCredit, setShowCredit] = useState(false);
  const [showStatistique, setShowStatistique] = useState(false);
  const [potionUsed, setPotionUsed] = useState(false);
  const [showPartie, setShowPartie] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          bonusResponse,
          monstresResponse,
          joueursResponse,
          typeSectionsResponse,
          sectionsResponse,
        ] = await Promise.all([
          axios.get("http://localhost:3200/bonus"),
          axios.get("http://localhost:3200/monstres"),
          axios.get("http://localhost:3200/joueurs"),
          axios.get("http://localhost:3200/typesections"),
          axios.get("http://localhost:3200/sections"),
        ]);
        setBonus(bonusResponse.data);
        setMonstres(monstresResponse.data);
        setJoueurs(joueursResponse.data);
        setTypeSections(typeSectionsResponse.data);
        setSections(sectionsResponse.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };
    fetchData();
  }, []);

  const handleCreatePerso = async (
    nom,
    maxHabilite,
    habilite,
    maxEndurance,
    endurance,
    maxChance,
    chance,
    potion = ""
  ) => {
    if (!chance || !endurance || !habilite) {
      window.alert("Veuillez lancer les dés");
    } else if (potion == "") {
      window.alert("Veuillez choisir une potion");
    } else {
      
      const newJoueur = {
        "Nom": nom || "Nobody",
        "Section": 1, 
        "Sections": [1],
        "MaxHabilite": maxHabilite,
        "Habilite": habilite,
        "MaxEndurance": maxEndurance,
        "Endurance": endurance,
        "MaxChance": maxChance,
        "Chance": chance,
        "PieceOr": 20,
        "Potion": potion,
        "Arme": "",
        "Bouclier": "",
        "Bijou": "",
        "Isfinish": false
      };

      try {
        const response = await axios.post(
          "http://localhost:3200/joueur",
          newJoueur
        );

        let returnPlayer = response.data;
        returnPlayer.sections = [1];

          setJoueur(returnPlayer);

          let listJoueurs = Array.isArray(joueurs) ? [...joueurs] : Object.values(joueurs);  
          listJoueurs.push(returnPlayer);
          setJoueurs(listJoueurs);               

          handleGetSection(1);
          setShowForm(false);
      } catch (error) {
          console.error('Erreur lors de l\'ajout du joueur :', error);
      } finally {
        setPotionUsed(false);
      }
    }
  };

  const handleGetSection = async (id) => {
    setSection(sections.filter((e) => e.id == id)[0]);
  };

  const handleChangeSection = (choiceNumber) => {
    const idNextSection = (() => {
      switch (choiceNumber) {
        case 1:
          handleChangePlayerFromSection(section.typebonus1, section.direction1);
          return section.direction1;
        case 2:
          handleChangePlayerFromSection(section.typebonus2, section.direction2);
          return section.direction2;
        case 3:
          handleChangePlayerFromSection(section.typebonus3, section.direction3);
          return section.direction3;
        default:
          return null;
      }
    })();

    handleGetSection(idNextSection);
  };

  const handleChangePlayerFromSection = (typeBonus, idNextSection) => {
    let editablePlayer = { ...joueur };
    editablePlayer.sections = transformSections(editablePlayer.sections);
    editablePlayer.sections.push(idNextSection);
    editablePlayer.section = idNextSection;

    switch (typeBonus) {
      case 1:
        editablePlayer.endurance = joueur.maxendurance;
        break;
      case 2:
        editablePlayer.endurance = joueur.endurance + 2;
        break;
      case 3:
        editablePlayer.endurance = joueur.endurance - 2;
        break;
      case 4:
        editablePlayer.habilite = joueur.habilite - 1;
        break;
      case 5:
        editablePlayer.habilite = joueur.habilite - 2;
        break;
      case 6:
        editablePlayer.chance = joueur.maxchance;
        break;
      case 7:
        editablePlayer.chance = joueur.chance - 1;
        break;
      case 8:
        editablePlayer.bouclier = "Bouclier";
        break;
      case 9:
        editablePlayer.arme = "Epee";
        break;
      case 10:
        editablePlayer.bijou = "Bague";
        editablePlayer.maxEndurance = joueur.maxendurance + 1;
        break;
      case 11:
        editablePlayer.bijou = "Collier";
        editablePlayer.maxchance = joueur.maxchance + 1;
        break;
      case 12:
        setPotionUsed(false);
        break;
      case 13:
        editablePlayer.arme = "Epee";
        editablePlayer.endurance = joueur.maxendurance;
        break;
      case 15:
        editablePlayer.arme = "Epee";
        editablePlayer.pieceor = joueur.pieceor - 10;
        break;
      case 16:
        editablePlayer.bouclier = "Bouclier";
        editablePlayer.pieceor = joueur.pieceor - 10;
        break;
    }
    setJoueur(editablePlayer);
  };

  const handleEditPerso = async () => {
    if (joueur) {
      const newJoueur = {
          "Section": joueur.section, 
          "Sections": joueur.sections,
          "Habilite": joueur.habilite,
          "Endurance": joueur.endurance,
          "Chance": joueur.chance,
          "PieceOr": joueur.pieceor,
          "Potion": joueur.potion,
          "Arme": joueur.arme,
          "Bouclier": joueur.bouclier,
          "Bijou": joueur.bijou,
          "Isfinish": joueur.isfinish
      };

      try {
        const response = await axios.put(`http://localhost:3200/joueur/${joueur.id}`, newJoueur);
        const updatedPlayer = response.data;
      
        let listJoueurs = Array.isArray(joueurs) ? [...joueurs] : Object.values(joueurs);
      
        const playerIndex = listJoueurs.findIndex(e => e.id === updatedPlayer.id);
      
        if (playerIndex !== -1) {
          listJoueurs[playerIndex] = updatedPlayer;
        } else {
          listJoueurs.push(updatedPlayer);
        }
      
        setJoueurs(listJoueurs);
      } catch (error) {
        console.error('Erreur lors de la modification du joueur :', error);
      }

    } else {
      window.alert("Pas de joueur selectioné.");
    }
  };
  
  const transformSections = (sections) => {
    console.log("Section entrée");
    console.log(sections);
    if (typeof sections === 'string') {
      try {
        const cleanedSections = sections.replace(/[\{\}"]/g, '').split(',').map(Number);
        console.log("Section clean");
        console.log(cleanedSections);
        return cleanedSections;
      } catch (error) {
        console.error('Erreur lors de la transformation des sections :', error);
        return [];
      }
    }
    return sections;
  };

  const handleStart = (lastPlayer) => {
    if (lastPlayer) {
      lastPlayer.sections = transformSections(lastPlayer.sections);
      lastPlayer.isfinish = false;
      setJoueur(lastPlayer);
      setShowPartie(false)
      handleGetSection(lastPlayer.section);
    }
  };

  const handleReplay = async () => {
    await handleEditPerso();
    setJoueur(null);
    setSection(null);
  };

  const handleJouerButton = () => {
    handlePlayMusic()
    setShowForm(!showForm)
    if(showPartie) setShowPartie(!showPartie)
    if(showStatistique) setShowStatistique(!showStatistique)
  };

  const handleReprendreButton = () => {
    handlePlayMusic()
    setShowPartie(!showPartie)
    if(showForm) setShowForm(!showForm)
    if(showStatistique) setShowStatistique(!showStatistique)
  };

  const handleStatistiquesButton = () => {
    setShowStatistique(!showStatistique)
    if (showCredit) setShowCredit(!showCredit);
    if (showForm) setShowForm(!showForm);
    if (showPartie) setShowForm(!showPartie);
  };

  const handlePlayMusic = () => {
    setIsMusicPlaying(true);
  };

  const handlePauseMusic = () => {
    setIsMusicPlaying(false);
  };

  return (
    <>
    
    <BackgroundMusic isPlaying={isMusicPlaying} />
    {!section && !showCredit && (
        <div className='blockAccueil'>
          <h1>Cayden Quest</h1>
        
          <button className='buttonAccueil' onClick={() => handleJouerButton()}>Jouer</button>
          <button className='buttonAccueil' onClick={() => handleReprendreButton()}>Reprendre</button>
          <button className='buttonAccueil' onClick={() => setShowCredit(!showCredit)}>Crédits</button>
          <button className="buttonAccueil" onClick={() => handleStatistiquesButton ()}>Statistiques</button>
        </div>
      )}

      {showCredit && <Credits showCredit={showCredit} setShowCredit={setShowCredit} />}
      {(showForm && !showPartie) && <CreatePlayerForm onCreatePlayer={handleCreatePerso} />}
      {(showPartie && !showForm) && <ChoixPartie joueurs={joueurs} sections={sections} onChoisirJoueur={handleStart}/>}



      {showStatistique && (
        <Statistique
          showStatistique={showStatistique}
          setShowStatistique={setShowStatistique}
        />
      )}

      {joueur && !showForm && section && 
        <Section 
          joueur={joueur}  
          monstres={monstres} 
          section={section} 
          potionUsed={potionUsed} 
          handleChangeSection={handleChangeSection} 
          setJoueur={setJoueur} 
          handleReplay={handleReplay} 
          setPotionUsed={setPotionUsed} 
          handleEditPerso={handleEditPerso} 
        />
      }

      <div style={{ position: 'absolute', bottom: '150px', right: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <button onClick={() => setIsMusicPlaying(!isMusicPlaying)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px' }}>
        {isMusicPlaying ? <MdMusicNote style={{ fontSize: '48px' }} /> : <MdMusicOff style={{ fontSize: '48px' }} />}
      </button>
       {/* <button onClick={() => handleClick('Eco')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px' }}>
        <MdEco style={{ fontSize: '48px' }} />
      </button>
      <button onClick={() => handleClick('Exit')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px' }}>
        <MdExitToApp style={{ fontSize: '48px' }} />
      </button> */}


      {/* Enelever ce composant quand on rend */}
      {/* <div  style={{ position: 'absolute', bot: '20px', left: '20px' }} >
        <DataModal
          joueur={joueur}
          section={section}
          bonus={bonus}
          monstres={monstres}
          joueurs={joueurs}
          typeSections={typeSections}
          sections={sections}
        />
      </div> */}
    </div>
    </>
  );
}

export default MainQuestComponent;
