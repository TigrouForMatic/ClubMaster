import React, { useState, useEffect } from "react";
import './App.css'
import './styles/navbarStyles.css'; 
import SideBarContainer from './components/Menu/SideBarContainer';
import SideBarContainerMobile from './components/Menu/SideBarContainerMobile';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomeView from './views/HomeView';
import MatchsView from './views/MatchsView';
import CalendarView from './views/CalendarView';
import ShopView from './views/ShopView';
// import ChatView from './views/ChatView';

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
    <Router>
      <div className="App">
        {isMobile ? <SideBarContainerMobile /> : <SideBarContainer />}
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/matchs" element={<MatchsView />} />
          {/* <Route path="/chat" element={<ChatView />} /> */}
          <Route path="/calendrier" element={<CalendarView />} />
          <Route path="/shop" element={<ShopView />} />
        </Routes>
      </div>
    </Router>
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
