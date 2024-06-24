import React, { useState, useEffect } from 'react';
import blocText from '../../../assets/bloc_text.png';
import './styleSection.css';

const SectionDescritpionQuestion = ({ section }) => {
  const maxLength = 400;
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);

  useEffect(() => {
    // Gesstion de l'affichage de la description en page
    if (section && section.description) {
      //Récupération de la description de la page
      const text = section.description;
      //Regex pour récuperé les pages
      const phrases = text.match(/[^\.!\?]+[\.!\?]+/g) || [];
      const paginatedText = [];
      let currentPageText = '';

      //Séparation des phrase en fonction de la taille de la description en page
      phrases.forEach(sentence => {
        if (currentPageText.length + sentence.length + 1 <= maxLength) {
          currentPageText += (currentPageText ? ' ' : '') + sentence;
        } else {
          paginatedText.push(currentPageText);
          currentPageText = sentence;
        }
      });

      if (currentPageText) {
        paginatedText.push(currentPageText);
      }
      // Initialisation pour la page 0 de la description
      setPages(paginatedText);
      setCurrentPage(0); 
    }
  }, [section]);

  //Fonction pour gestion des pages
  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, pages.length - 1));
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  return (
    <>
      <img className='imgBlocText' src={blocText} alt='blocText' />
      <div className='cardDescription'>
        {section && section.description && (
          <span className='textCardDescription description'>
            {pages[currentPage]}
          </span>
        )}

        <br></br>

        {section && section.question && (
          <span className='textCard'>{section.question}</span>
        )}
        
        {
        // Affichage ou non des boutons
        pages.length > 1 && (
          <div className='pagination-controls'>
            <button className='ButtonPrecedent' onClick={prevPage} disabled={currentPage === 0}>
              Précédent
            </button>
            <button className='ButtonSuivant' onClick={nextPage} disabled={currentPage === pages.length - 1}>
              Suivant
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default SectionDescritpionQuestion;
