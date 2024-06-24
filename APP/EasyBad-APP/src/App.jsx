import React, { useState, useEffect } from "react";
import './App.css'
import './styles/navbarStyles.css'; 
import SideBarContainer from './components/Menu/SideBarContainer';
import SideBarContainerMobile from './components/Menu/SideBarContainerMobile';

function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {isMobile && <SideBarContainerMobile /> ||  <SideBarContainer />}
    </>
  )
}

export default App;
