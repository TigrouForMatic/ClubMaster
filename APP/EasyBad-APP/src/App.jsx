import React, { lazy, Suspense, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { MobileProvider, useMobile } from './contexts/MobileContext';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import AuthForm from './components/Authentification/AuthForm';
import './App.css'
import './styles/navbarStyles.css';

// Lazy loading des composants
const SideBarContainer = lazy(() => import('./components/Menu/SideBarContainer'));
const SideBarContainerMobile = lazy(() => import('./components/Menu/MenuBarMobile'));
const HomeView = lazy(() => import('./views/HomeView'));
const MatchsView = lazy(() => import('./views/MatchsView'));
const CalendarView = lazy(() => import('./views/CalendarView'));
const ShopView = lazy(() => import('./views/ShopView'));
const UserView = lazy(() => import('./views/UserView'));

// Constantes pour les routes
const ROUTES = {
  HOME: '/',
  MATCHS: '/match',
  CALENDAR: '/calendar',
  SHOP: '/shop',
  USER: '/user',
};

function AppContent() {
  const isMobile = useMobile();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return (
        <AuthForm onAuthenticate={() => setIsAuthenticated(true)} />
    );
  }

  return (
    <div className="App">
      <Suspense fallback={<LoadingSpinner />}>
        {isMobile ? <SideBarContainerMobile /> : <SideBarContainer />}
        <Routes>
          <Route path={ROUTES.HOME} element={<HomeView />} />
          <Route path={ROUTES.MATCHS} element={<MatchsView />} />
          <Route path={ROUTES.CALENDAR} element={<CalendarView />} />
          <Route path={ROUTES.SHOP} element={<ShopView />} />
          <Route path={ROUTES.USER} element={<UserView />} />
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
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