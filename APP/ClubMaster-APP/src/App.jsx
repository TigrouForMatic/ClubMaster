import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { MobileProvider, useMobile } from './contexts/MobileContext';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import NotificationContainer from './components/Notification/NotificationContainer';
import DataLoader from './components/DataLoader';
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

// Layout principal de l'application
function MainLayout() {
  const isMobile = useMobile();
  
  return (
    <div>
      <Suspense fallback={<LoadingSpinner />}>
        {isMobile ? <SideBarContainerMobile /> : <SideBarContainer />}
        <Outlet />
      </Suspense>
    </div>
  );
}

// Configuration du routeur
const router = createBrowserRouter([
  {
    path: "/auth/login",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/auth/google/callback",
    element: <GoogleCallback />,
  },
  {
    path: "/auth/personal-info",
    element: (  
      <PersonalInfoForm />
    ),
  },
  {
    path: "/auth/find-club",
    element: (
        <MobileProvider>
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <FindClubOption />
            </Suspense>
          </ErrorBoundary>
        </MobileProvider>
    ),
  },
  {
    path: "/",
    element: (
        <DataLoader>
          <MainLayout />
        </DataLoader>
    ),
    children: [
      {
        index: true,
        element: <HomeView />,
      },
      {
        path: "match",
        element: <MatchsView />,
      },
      {
        path: "calendar",
        element: <CalendarView />,
      },
      {
        path: "shop",
        element: <ShopView />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "manage",
        element: <ManageView />,
      },
      {
        path: "user",
        element: <UserView />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
    v7_normalizeFormMethod: true
  }
});

function App() {
  return (
    <MobileProvider>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </MobileProvider>
  );
}

export default App;