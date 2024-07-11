import React, { lazy, Suspense, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { MobileProvider, useMobile } from './contexts/MobileContext';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import AuthForm from './components/Authentification/AuthForm';
import NotificationContainer from './components/Notification/NotificationContainer';
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

const notifications = [
  { label: "Nouvelle mise à jour disponible", time: "2024-07-10 14:30:20" },
  { label: "Message reçu de Jean", time: "2024-07-10 15:45:02" },
  { label: "Rappel : Réunion à 16h" },
];

function AppContent() {
  const isMobile = useMobile();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return (
      isMobile ? (
        <AuthForm onAuthenticate={() => setIsAuthenticated(true)} />
      ) : (
        // <div style={{
        //   display: 'flex',
        //   justifyContent: 'center',
        //   alignItems: 'center',
        //   height: '75vh'
        // }}>
        // <div style={{ marginTop: '100px' }}>
          <AuthForm onAuthenticate={() => setIsAuthenticated(true)} />
        // </div>
      )
    );
  }

  return (
    <div className="App">
      <Suspense fallback={<LoadingSpinner />}>
        {isMobile ? <SideBarContainerMobile /> : <SideBarContainer />}
        <NotificationContainer notifications={notifications} />
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