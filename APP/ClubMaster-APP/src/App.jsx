import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { UNSAFE_DataRouterContext } from 'react-router-dom';
import { MobileProvider, useMobile } from './contexts/MobileContext';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import NotificationContainer from './components/Notification/NotificationContainer';
import DataLoader from './components/DataLoader';
import AuthService from './js/authService';
import './App.css';

// Lazy loading des composants
const Login = lazy(() => import('./components/Authentification/AuthForm'));
const PersonalInfoForm = lazy(() => import('./components/Authentification/PersonalInfoForm'));
const FindClubOption = lazy(() => import('./components/Authentification/AuthFindClubOption'));
const GoogleCallback = lazy(() => import('./components/Authentification/GoogleCallback'));
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
  MANAGE: '/manage',
};

// Configuration des flags pour React Router v7
UNSAFE_DataRouterContext.future = {
  v7_startTransition: true,
  v7_relativeSplatPath: true
};

function AppContent() {
  const isMobile = useMobile();

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
  return (
    <Router>
      <ErrorBoundary>
        <MobileProvider>
          <NotificationContainer />
          <Routes>
            {/* Routes publiques pour l'authentification */}
            <Route path="/auth" element={
              !AuthService.isAuthenticated() ? <Login /> : <Navigate to="/auth/personal-info" replace />
            } />
            <Route path="/auth/google/callback" element={<GoogleCallback />} />

            <Route path="/auth/personal-info" element={
              !AuthService.isPersonalInfoSet() ? <PersonalInfoForm /> : <Navigate to="/auth/find-club" replace />
            } />

            <Route path="/auth/find-club" element={
              !AuthService.isUserClubsSet() ? <FindClubOption /> : <Navigate to="/" replace />
            } />

            <Route path="/" element={
              AuthService.isAuthenticated() && AuthService.isPersonalInfoSet() && AuthService.isUserClubsSet() ? 
              <DataLoader>
                <AppContent />
              </DataLoader> 
              : <Navigate to="/auth" replace />
            } />

          </Routes>
        </MobileProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;