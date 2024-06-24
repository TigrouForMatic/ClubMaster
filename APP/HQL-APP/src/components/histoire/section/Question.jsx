import React, { useState } from 'react';
import Levenshtein from '../../../script/Levenshtein/Levenshtein'; 
import './Question.css';

const ComposantQuestion = ({ section,degreErreur, onResultat }) => {
    const [afficherQuestion, setAfficherQuestion] = useState(false);

    const gererAfficherQuestion = () => {
        setAfficherQuestion(true);
    };

    const gererValiderReponse = () => {
        const userInput = document.querySelector('input[type="text"]').value;
        const degreReponse = Levenshtein(userInput, section.reponse);
        
        if (degreReponse <= degreErreur){
            onResultat(1)
        }else{
            onResultat(2)
        }
    };

    return (
        <div className="ComposantQuestion">
            <input type="text" className="textInput" />
            <button className="questionButton" onClick={gererAfficherQuestion}>?</button>
            <button className="validerButton" onClick={gererValiderReponse}>Valider</button>
            {afficherQuestion && (
                <div>
                    <p>{section.question}</p>
                </div>
            )}
        </div>
    );
};

export default ComposantQuestion;
