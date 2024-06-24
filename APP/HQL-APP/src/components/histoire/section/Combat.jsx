import React, { useState, useEffect } from 'react';
import './styleSection.css';
import Orc from '../../../assets/monstres/Orc.png';
import Fantome from '../../../assets/monstres/Fantome.png';
import Gobelin from '../../../assets/monstres/Gobelin.png';
import Boss from '../../../assets/monstres/Boss.png';
import Slime from '../../../assets/monstres/Slime.png';
import Géant from '../../../assets/monstres/Géant.png';
import BossAffaiblie from '../../../assets/monstres/BossAffaiblie.png';


const Combat = ({ section,joueur,monstre, fuitePossible, handleChangeSection, setJoueur }) => {
    const [combatEnCours, setCombatEnCours] = useState(false);
    const [enduranceMonstre, setEnduranceMonstre] = useState(monstre.endurance);
    const [resultatCombat, setResultatCombat] = useState('');
    const [attaqueEffectuee, setAttaqueEffectuee] = useState(false);
    const [AttaquerMonstre, setAttaquerMonstre] = useState(false);

    const lancerDes = () => Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;

    const monsterImages = {
        Orc: Orc,
        Fantome: Fantome,
        Gobelin: Gobelin,
        Boss: Boss,
        Slime: Slime,
        Géant: Géant,
        'Boss affaiblie': BossAffaiblie
    };

    useEffect(() => {
        if (enduranceMonstre <= 0) {
            handleChangeSection(1);
        }
        if (joueur.endurance <= 0) {
            handleChangeSection(2);
        }
    }, [enduranceMonstre, joueur.endurance, section.choix1, section.choix2, handleChangeSection]);


    const gererCombat = () => {
        const forceAttaqueJoueur = lancerDes() + joueur.habilite;
        const forceAttaqueMonstre = lancerDes() + monstre.habilite;

        if (forceAttaqueJoueur > forceAttaqueMonstre) {
            setResultatCombat(`Vous allez attaquer le monstre.`);
            setAttaquerMonstre(true)
        } else if (forceAttaqueJoueur < forceAttaqueMonstre) {
            setResultatCombat(`Le monstre va vous attaquer.`);
            setAttaquerMonstre(false)
        } else {
            setResultatCombat("Aucun des deux n'a été blessé.");
        }
        setAttaqueEffectuee(true);
    };

    const fuirCombat = () => {
        setCombatEnCours(false);
        setResultatCombat('Vous avez fui le combat et perdu 2 points d\'endurance.');
        setJoueur(joueur);
        handleChangeSection(3);
    };

    const tenterChance = () => {
        const resultatChance = lancerDes();
        let degat = 0;
        if (AttaquerMonstre){
            if (resultatChance -2 <= joueur.chance) {
                if (joueur.arme){
                    degat = 5
                }else{
                    degat = 4
                }
                setEnduranceMonstre(enduranceMonstre - degat);
                setResultatCombat('Vous avez eu de la chance et infligé ' + degat +' points de dégâts au monstre.');
            }else{
                if (joueur.arme){
                    degat = 2
                }else{
                    degat = 1
                }
                setEnduranceMonstre(enduranceMonstre - degat);
                setResultatCombat('vous avez été malchanceux et infligé ' + degat + ' points de dégâts au monstre.');
            }
        } else {
            if (resultatChance <= joueur.chance) {
                if(joueur.bouclier){
                    degat = 0;
                }else{
                    degat = 1;
                }
                setJoueur({ ...joueur, endurance: joueur.endurance - degat });
                setResultatCombat('Vous avez eu de la chance et vous recevez ' + degat + ' point de dégât.');
            }else{
                if(joueur.bouclier){
                    degat = 2;
                }else{
                    degat = 3;
                }
                setJoueur({ ...joueur, endurance: joueur.endurance - degat });
                setResultatCombat('vous avez été malchanceux et vous recevez ' + degat + ' points de dégât.');
            }
        }

        if (joueur.chance > 0){
            joueur.chance -= 1;
        }

        setAttaqueEffectuee(false);
    };

    const nePasTenterChance = () => {
        setResultatCombat('Vous avez décidé de ne pas tenter votre chance.');
        let degat = 0;
        if (AttaquerMonstre) {
            if(joueur.bouclier){
                degat = 0;
            }else{
                degat = 1;
            }
            setEnduranceMonstre(enduranceMonstre - degat);
            setResultatCombat(`Vous avez infligé 2 points de dégâts au monstre.`);
        } else {
            if(joueur.bouclier){
                degat = 0;
            }else{
                degat = 1;
            }
            setJoueur({ ...joueur, endurance: joueur.endurance - degat });
            setResultatCombat(`Le monstre vous a attaqué et vous a infligé 2 points de dégâts.`);
        }
        setAttaqueEffectuee(false);
    };
    
    return (
        <div>
            
            <h2>Combat avec {monstre.nom}</h2>
            <p>Endurance du monstre: {enduranceMonstre}</p>
            {!combatEnCours && (
                <>
                    <button className='buttonCombat' onClick={() => setCombatEnCours(true)}>Commencer le combat</button>
                </>
            )}
            {combatEnCours && (
                <>
                    {!attaqueEffectuee && (<button className='buttonCombat buttonCombat--mainAction' onClick={gererCombat}>Attaquer</button>)}
                    {attaqueEffectuee && (
                        <>
                            <button className='buttonCombat buttonCombat--mainAction' onClick={tenterChance}>Tenter votre chance</button>
                            <button className='buttonCombat' onClick={nePasTenterChance}>Ne pas tenter la chance</button>
                        </>
                    )}
                    {!attaqueEffectuee && fuitePossible && <button className='buttonCombat'onClick={fuirCombat}>Fuir</button>}
                    <p>Résultat du combat: {resultatCombat}</p>
                </>
            )}
            <img className='imgMonstre' src={monsterImages[monstre.nom]} alt={monstre.nom} />
        </div>
        
    );
};

export default Combat;