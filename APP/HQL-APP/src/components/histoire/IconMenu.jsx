import React from 'react';
import { MdExitToApp, MdMusicNote, MdMusicOff, MdEco } from 'react-icons/md';

const IconMenu = (isMusicPlaying, handlePlayMusic, handlePauseMusic) => {

  const handleClickMusic = () => {
      if (isMusicPlaying) handlePauseMusic()
      else handlePauseMusic()
  };

  const handleClick = (icon) => {
    console.log(`${icon} clicked`);
    // Ajoutez ici la logique spécifique pour chaque icône
  };

  return (
    <div style={{ position: 'absolute', bottom: '20px', right: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <button onClick={() => handleClickMusic()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px' }}>
        {isMusicPlaying ? <MdMusicNote style={{ fontSize: '48px' }} /> : <MdMusicOff style={{ fontSize: '48px' }} />}
      </button>
      <button onClick={() => handleClick('Eco')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px' }}>
        <MdEco style={{ fontSize: '48px' }} />
      </button>
      <button onClick={() => handleClick('Exit')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px' }}>
        <MdExitToApp style={{ fontSize: '48px' }} />
      </button>
    </div>
  );
};

export default IconMenu;
