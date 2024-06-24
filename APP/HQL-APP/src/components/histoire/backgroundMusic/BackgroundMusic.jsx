import React, { useRef, useEffect } from 'react';
import musique from '../../../assets/audio/musique_fond.mp3';

const BackgroundMusic = ({ isPlaying }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.volume = 1;
        audio.play().catch(error => {
          console.error("Erreur lors de la lecture :", error);
        });
      } else {
        audio.pause();
      }
    }
  }, [isPlaying]);

  return (
    <audio ref={audioRef} loop>
      <source src={musique} type="audio/mpeg" />
      Votre navigateur ne supporte pas lélément audio.
    </audio>
  );
};

export default BackgroundMusic;
