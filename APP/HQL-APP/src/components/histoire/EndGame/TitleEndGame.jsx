import React, { useState, useEffect } from 'react';
import dead from '../../../assets/3dar.gif'; 
import win from '../../../assets/3VQL.gif';
import './EndGame.css';

const TitleEndGame = ({ name, section }) => {
    const [title, setTitle] = useState("");

    useEffect(() => {
        setTitle(handleTitle());
    }, [section]);

    const handleTitle = () => {
        if (section && section.type) {
            const { type, description } = section;
            if (type === 1) {
                return (<><img src={win} alt="win"/><p className="p">{name} vous avez Gagné ! {description}</p></>);
            } else if (type === 2) {
                return (<><img src={dead} alt='3dar' /><p className="p">{name} vous avez PERDU LAMENTABLEMENT ! {description}</p></>);
            }
        }
        
        return (<><img src={win} alt='win' /> <p className="p">Erreur du système en votre faveur. Pour cela, on va dire que vous avez gagné :) Ça restera notre petit secret ;)</p></>);
    };

    return (
        <div className="cardTitle card ">
            <h2 className="cardText">{title}</h2>
        </div>
    );
};

export default TitleEndGame;
