import React, { useState } from 'react';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    color: 'black'
  },
  listContainer: {
    overflowY: 'auto',
    maxHeight: '80vh',
  },
  listItem: {
    cursor: 'pointer',
    marginBottom: '10px',
    border: '1px solid black',
    padding: '5px',
    listStyleType: "none"
  },
  closeButton: {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    cursor: 'pointer',
  },
  typeList: {
    marginBottom: '15px'
  }
};

const DataModal = ({ joueur, section, bonus, monstres, typeSections, sections, joueurs }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleItemClick = (item) => setSelectedItem(item);

  return (
    <div>
      <button onClick={openModal}>See Data</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Data Modal"
      >
        <div style={customStyles.listContainer}>
          <ul>
            <li style={customStyles.listItem} onClick={() => handleItemClick("joueur")}>Joueur</li>
            <li style={customStyles.listItem} onClick={() => handleItemClick("section")}>Section</li>
            <li style={customStyles.listItem} onClick={() => handleItemClick("bonus")}>Bonus</li>
            <li style={customStyles.listItem} onClick={() => handleItemClick("monstres")}>Monstres</li>
            <li style={customStyles.listItem} onClick={() => handleItemClick("typeSections")}>Type de sections</li>
            <li style={customStyles.listItem} onClick={() => handleItemClick("sections")}>Sections</li>
            <li style={customStyles.listItem} onClick={() => handleItemClick("joueurs")}>Joueurs</li>
          </ul>
        </div>
        <div>
          <h2>Details</h2>
          {selectedItem === "joueur" && joueur && (
            <div>
              <p>Id: {joueur.id}</p>
              <p>Nom: {joueur.nom}</p>
              <p>Section: {joueur.section}</p>
              <p>Sections: {joueur.sections}</p>
              <p>MaxHabilite: {joueur.maxhabilite}</p>
              <p>Habilite: {joueur.habilite}</p>
              <p>MaxEndurance: {joueur.maxendurance}</p>
              <p>Endurance: {joueur.endurance}</p>
              <p>MaxChance: {joueur.maxchance}</p>
              <p>Chance: {joueur.chance}</p>
              <p>PieceOr: {joueur.pieceor}</p>
              <p>Potion: {joueur.potion}</p>
              <p>Arme: {joueur.arme}</p>
              <p>Bouclier: {joueur.bouclier}</p>
              <p>Bijou: {joueur.bijou}</p>
              <p>Isfinish: {joueur.isfinish}</p>
            </div>
          )}
          {selectedItem === "section" && section && (
            <div>
              <p>Id: {section.id}</p>
              <p>Libelle: {section.libelle}</p>
              <p>Description: {section.description}</p>
              <p>Type: {section.type}</p>
              <p>IdMonstre: {section.idMonstre}</p>
              <p>Choix1: {section.choix1}</p>
              <p>Choix2: {section.choix2}</p>
              <p>Choix3: {section.choix3}</p>
              <p>Direction1: {section.direction1}</p>
              <p>Direction2: {section.direction2}</p>
              <p>Direction3: {section.direction3}</p>
              <p>TypeBonus1: {section.typeBonus1}</p>
              <p>TypeBonus2: {section.typeBonus2}</p>
              <p>TypeBonus3: {section.typeBonus3}</p>
              <p>Question: {section.question}</p>
              <p>Reponse: {section.reponse}</p>
            </div>
          )}
          {selectedItem === "bonus" && bonus && (
            bonus.map(b => <div key={b.id}>id: {b.id}, nom: {b.nom}</div>)
          )}
          {selectedItem === "monstres" && monstres && (
            monstres.map(m => (
              <div key={m.id}>
                <p>id: {m.id}, nom: {m.nom}, endurance: {m.endurance}, habilite: {m.habilite}</p>
              </div>
            ))
          )}
          {selectedItem === "typeSections" && typeSections && (
            typeSections.map(ts => (
              <div key={ts.id}>
                <p>id: {ts.id}, libelle: {ts.libelle}</p>
              </div>
            ))
          )}
          {selectedItem === "sections" && sections && (
            sections.map(ss => (
                <div key={ss.id}>
                   <p>Id: {ss.id}</p>
                    <p>Libelle: {ss.libelle}</p>
                    <p>Description: {ss.description}</p>
                    <p>Type: {ss.type}</p>
                    <p>IdMonstre: {ss.idMonstre}</p>
                    <p>Choix1: {ss.choix1}</p>
                    <p>Choix2: {ss.choix2}</p>
                    <p>Choix3: {ss.choix3}</p>
                    <p>Direction1: {ss.direction1}</p>
                    <p>Direction2: {ss.direction2}</p>
                    <p>Direction3: {ss.direction3}</p>
                    <p>TypeBonus1: {ss.typeBonus1}</p>
                    <p>TypeBonus2: {ss.typeBonus2}</p>
                    <p>TypeBonus3: {ss.typeBonus3}</p>
                    <p>Question: {ss.question}</p>
                    <p>Reponse: {ss.reponse}</p>
                </div>
              ))
          )}
          {selectedItem === "joueurs" && joueurs && (
            joueurs.map(js => (
                <div key={js.id}>
                   <p>Id: {js.id}</p>
                    <p>Nom: {js.nom}</p>
                    <p>Section: {js.section}</p>
                    <p>Sections: {js.sections}</p>
                    <p>MaxHabilite: {js.maxhabilite}</p>
                    <p>Habilite: {js.habilite}</p>
                    <p>MaxEndurance: {js.maxendurance}</p>
                    <p>Endurance: {js.endurance}</p>
                    <p>MaxChance: {js.maxchance}</p>
                    <p>Chance: {js.chance}</p>
                    <p>PieceOr: {js.pieceor}</p>
                    <p>Potion: {js.potion}</p>
                    <p>Arme: {js.arme}</p>
                    <p>Bouclier: {js.bouclier}</p>
                    <p>Bijou: {js.bijou}</p>
                    <p>Isfinish: {js.isfinish}</p>
                </div>
              ))
          )}
        </div>

        <div style={customStyles.typeList}>
        {selectedItem === "joueur" && (
           <div>
            <p>Object</p>
            <p>Id:          Number</p>
            <p>Nom:         String</p>
            <p>Section:     Number</p>
            <p>Sections:    Array</p>
            <p>MaxHabilite: Number</p>
            <p>Habilite:    Number</p>
            <p>MaxEndurance:Number</p>
            <p>Endurance:   Number</p>
            <p>MaxChance:   Number</p>
            <p>Chance:      Number</p>
            <p>PieceOr:     Number</p>
            <p>Potion:      String</p>
            <p>Arme:        String</p>
            <p>Bouclier:    String</p>
            <p>Bijou:       String</p>
            <p>Isfinish:   Boolean</p>
        </div>
          )}
          {selectedItem === "section" && (
           <div>
            <p>Object</p>
            <p>Id:          Number</p>
            <p>Libelle:     String</p>
            <p>Description: Number</p>
            <p>IdMonstre:   Number</p>
            <p>Choix1:      Number</p>
            <p>Choix2:      Number</p>
            <p>Choix3:      Number</p>
            <p>Direction1:  Number</p>
            <p>Direction2:  Number</p>
            <p>Direction3:  Number</p>
            <p>TypeBonus1:  Number</p>
            <p>TypeBonus2:  Number</p>
            <p>TypeBonus3:  Number</p>
            <p>Question:    String</p>
            <p>Reponse:     String</p>
        </div>
          )}
          {selectedItem === "bonus" && (
            <div>
                <p>Array</p>
                <p>Id:          Number</p>
                <p>Nom:         String</p>
            </div>
          )}
          {selectedItem === "monstres" && (
            <div>
                <p>Array</p>
                <p>Id:          Number</p>
                <p>Nom:         String</p>
                <p>Endurance:   Number</p>
                <p>Habilite:    Number</p>
            </div>
          )}
          {selectedItem === "typeSections" && (
            <div>
                <p>Array</p>
                <p>Id:          Number</p>
                <p>Libelle:     String</p>
            </div>
          )}
          {selectedItem === "sections" && (
             <div>
                <p>Array</p>
                <p>Id:          Number</p>
                <p>Libelle:     String</p>
                <p>Description: Number</p>
                <p>IdMonstre:   Number</p>
                <p>Choix1:      Number</p>
                <p>Choix2:      Number</p>
                <p>Choix3:      Number</p>
                <p>Direction1:  Number</p>
                <p>Direction2:  Number</p>
                <p>Direction3:  Number</p>
                <p>TypeBonus1:  Number</p>
                <p>TypeBonus2:  Number</p>
                <p>TypeBonus3:  Number</p>
                <p>Question:    String</p>
                <p>Reponse:     String</p>
            </div>
          )}
          {selectedItem === "joueurs" && (
            <div>
                <p>Array</p>
                <p>Id:          Number</p>
                <p>Nom:         String</p>
                <p>Section:     Number</p>
                <p>Sections:    Array</p>
                <p>MaxHabilite: Number</p>
                <p>Habilite:    Number</p>
                <p>MaxEndurance:Number</p>
                <p>Endurance:   Number</p>
                <p>MaxChance:   Number</p>
                <p>Chance:      Number</p>
                <p>PieceOr:     Number</p>
                <p>Potion:      String</p>
                <p>Arme:        String</p>
                <p>Bouclier:    String</p>
                <p>Bijou:       String</p>
                <p>Isfinish:   Boolean</p>
            </div>
          )}
        </div>
        <button style={customStyles.closeButton} onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
};

export default DataModal;
