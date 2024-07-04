import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { MobileProvider, useMobile } from './contexts/MobileContext';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css'
import './styles/navbarStyles.css'; 
// import SideBarContainer from './components/Menu/SideBarContainer';
// import SideBarContainerMobile from './components/Menu/SideBarContainerMobile';

// Lazy loading des composants
const SideBarContainer = lazy(() => import('./components/Menu/SideBarContainer'));
const SideBarContainerMobile = lazy(() => import('./components/Menu/SideBarContainerMobile'));
const HomeView = lazy(() => import('./views/HomeView'));
const MatchsView = lazy(() => import('./views/MatchsView'));
const CalendarView = lazy(() => import('./views/CalendarView'));
const ShopView = lazy(() => import('./views/ShopView'));

// Constantes pour les routes
const ROUTES = {
  HOME: '/',
  MATCHS: '/matchs',
  CALENDAR: '/calendrier',
  SHOP: '/shop',
};

function AppContent() {
  const isMobile = useMobile();

  return (
    <div className="App">
      <Suspense fallback={<LoadingSpinner />}>
        {isMobile ? <SideBarContainerMobile /> : <SideBarContainer />}
        <Routes>
          <Route path={ROUTES.HOME} element={<HomeView />} />
          <Route path={ROUTES.MATCHS} element={<MatchsView />} />
          <Route path={ROUTES.CALENDAR} element={<CalendarView />} />
          <Route path={ROUTES.SHOP} element={<ShopView />} />
        </Routes>
      </Suspense>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <MobileProvider>
        <Router>
          <AppContent />
        </Router>
      </MobileProvider>
    </ErrorBoundary>
  );
}

export default App;
