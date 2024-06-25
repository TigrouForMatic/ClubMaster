import React, { useState, useEffect } from "react";
import './App.css'
import './styles/navbarStyles.css'; 
import SideBarContainer from './components/Menu/SideBarContainer';
import SideBarContainerMobile from './components/Menu/SideBarContainerMobile';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomeView from './views/HomeView';
import ActivityListView from './views/ActivityListView';
import ChatView from './views/ChatView';
import ContactView from './views/ContactView';
import ExportView from './views/ExportView';

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
         <Route path="/" exact component={HomeView} />
         <Route path="/activity" component={ActivityListView} />
         <Route path="/chat" component={ChatView} />
         <Route path="/contact" component={ContactView} />
         <Route path="/export" component={ExportView} />
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
