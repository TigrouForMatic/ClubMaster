import React from 'react';
import PotionChance from '../../../assets/PotionChance.svg'; 
import PotionEndurance from '../../../assets/PotionEndurance.svg';
import PotionHabilité from '../../../assets/PotionHabilité.svg';
import Epee from '../../../assets/Epee.svg';
import Bouclier from '../../../assets/Bouclier.svg';
import Bague from '../../../assets/Bague.svg';
import Collier from '../../../assets/Collier.svg';
import Pieceor from '../../../assets/GoldCoin.svg';
import Cadre from '../../../assets/Cadre.png';

const Inventory = ({ joueur, potionUsed, handlePotionEffect }) => {

  const renderPotion = () => {
    const imageStyle = potionUsed ? { filter: 'grayscale(100%)', pointerEvents: 'none' } : {};
    const potionInfo = {
      "PotionEndurance": { name: "Potion d'Endurance", description: "Régénère complètement votre Endurance" },
      "PotionChance": { name: "Potion de Chance", description: "Augmente votre Chance au maximum." },
      "PotionHabilité": { name: "Potion d'Habilité", description: "Augmente votre Habilité au maximum." },
    };

    const potion = potionInfo[joueur.potion];
    return potion ? (
      <div className='imgInventory' style={imageStyle}>
        <img onClick={() => !potionUsed && handlePotionEffect(potion.name)} className={`itmInventory item-potion item-potion--${joueur.potion.toLowerCase().split('Potion')[1]}`} src={PotionEndurance} alt={potion.name} />
        <div className="tooltip">
          <strong>{potion.name}</strong>
          <p>{potion.description}</p>
        </div>
      </div>
    ) : null;
  };

  const renderBijou = () => {
    const bijouInfo = {
      "Bague": { name: "Bague", description: "Une belle bague." },
      "Collier": { name: "Collier", description: "Un joli collier." },
    };

    const bijou = bijouInfo[joueur.bijou];
    return bijou ? (
      <div className='imgInventory'>
        <img className={`item-${joueur.bijou.toLowerCase()}`} src={Bague} alt={bijou.name} />
        <div className="tooltip">
          <strong>{bijou.name}</strong>
          <p>{bijou.description}</p>
        </div>
      </div>
    ) : null;
  };

  return (
    <>
      <img className='imgCadreInventory' src={Cadre} alt='cadre' />
      <div className='cardInventory'>
        <div>
          <p className='pieceLabel'><img className='item-piece' src={Pieceor} alt="piece en or" />{joueur.pieceor} pièces d'or</p>
          <div className="itmList">
            {joueur.potion && renderPotion()}
            {joueur.arme && (
                <div className='imgInventory'>
                  <img className='item-sword' src={Epee} alt="Épée" />
                  <div className="tooltip">
                    <strong>Épée</strong>
                    <p>Une épée tranchante.</p>
                    <p>+1 point de dégat sur les ennemis</p>
                  </div>
                </div>
            )}
            {joueur.bouclier && (
              <div className='imgInventory'>
                <img className='item-shield' src={Bouclier} alt="Bouclier" />
                <div className="tooltip">
                  <strong>Bouclier</strong>
                  <p>Un bouclier solide.</p>
                  <p>-1 point de dégat infligés par les ennemis</p>
                </div>
              </div>
            )}
          {joueur.bijou && renderBijou()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Inventory;
