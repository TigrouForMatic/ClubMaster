import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import useStore from './store/store';
import { MobileProvider, useMobile } from './contexts/MobileContext';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import AuthForm from './components/Authentification/AuthForm';
import NotificationContainer from './components/Notification/NotificationContainer';
import DataLoader from './components/DataLoader';
import './App.css';

// Lazy loading des composants
const SideBarContainer = lazy(() => import('./components/Menu/SideBarContainer'));
const SideBarContainerMobile = lazy(() => import('./components/Menu/MenuBarMobile'));
const HomeView = lazy(() => import('./views/HomeView'));
const MatchsView = lazy(() => import('./views/MatchsView'));
const CalendarView = lazy(() => import('./views/CalendarView'));
const ShopView = lazy(() => import('./views/ShopView'));
const ManageView = lazy(() => import('./views/ManageView'));
const CartPage = lazy(() => import('./views/CartPage'));
const UserView = lazy(() => import('./views/UserView'));

// Constantes pour les routes
const ROUTES = {
  HOME: '/',
  MATCHS: '/match',
  CALENDAR: '/calendar',
  SHOP: '/shop',
  CART: '/cart',
  USER: '/user',
  MANAGE: '/manage'
};

function AppContent() {
  const isMobile = useMobile();
  const showApp = useStore((state) => state.showApp);

  if (!showApp) {
    return (
        <AuthForm />
    );
  }

  return (
    <div>
      <Suspense fallback={<LoadingSpinner />}>
        {isMobile ? <SideBarContainerMobile /> : <SideBarContainer />}
        <Routes>
          <Route path={ROUTES.HOME}     element={<HomeView />}      />
          <Route path={ROUTES.MATCHS}   element={<MatchsView />}    />
          <Route path={ROUTES.CALENDAR} element={<CalendarView />}  />
          <Route path={ROUTES.SHOP}     element={<ShopView />}      />
          <Route path={ROUTES.CART}     element={<CartPage />}      />
          <Route path={ROUTES.MANAGE}   element={<ManageView />}    />
          <Route path={ROUTES.USER}     element={<UserView />}      />
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}

function App() {
  const showApp = useStore((state) => state.showApp);

  return (
    <Router>
      {!showApp ? (
        <AuthForm />
      ) : (
        <DataLoader>
          <ErrorBoundary>
            <MobileProvider>
              <AppContent />
            </MobileProvider>
          </ErrorBoundary>
        </DataLoader>
      )}
    </Router>
  );
}

export default App;