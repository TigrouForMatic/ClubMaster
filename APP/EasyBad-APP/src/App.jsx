import React, { useState, useEffect } from "react";
import './App.css'
import './styles/navbarStyles.css'; 
import SideBarContainer from './components/Menu/SideBarContainer';
import SideBarContainerMobile from './components/Menu/SideBarContainerMobile';

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const debounceHandleResize = debounce(handleResize, 100);

    window.addEventListener('resize', debounceHandleResize);

    return () => {
      window.removeEventListener('resize', debounceHandleResize);
    };
  }, []);

  return (
    <>
      {isMobile ? <SideBarContainerMobile /> : <SideBarContainer />}
    </>
  )
}

export default App;

// Utilitaire de debounce
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
