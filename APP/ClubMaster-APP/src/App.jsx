import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider, Navigate, Outlet, useNavigate } from 'react-router-dom';
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

// Composant de protection des routes
const ProtectedRoute = ({ children, condition, redirectTo }) => {
  const navigate = useNavigate();
  const [hasRedirected, setHasRedirected] = React.useState(false);
  
  React.useEffect(() => {
    if (!condition && !hasRedirected) {
      setHasRedirected(true);
      navigate(redirectTo, { replace: true });
    }
  }, [condition, redirectTo, navigate, hasRedirected]);

  return condition ? children : <LoadingSpinner />;
};

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
      <ProtectedRoute 
        condition={!AuthService.isAuthenticated()} 
        redirectTo="/"
      >
        <Login />
      </ProtectedRoute>
    ),
  },
  {
    path: "/auth/google/callback",
    element: <GoogleCallback />,
  },
  {
    path: "/auth/personal-info",
    element: (
      <ProtectedRoute 
        condition={AuthService.isAuthenticated() && !AuthService.isPersonalInfoSet()} 
        redirectTo="/auth/login"
      >
        <PersonalInfoForm />
      </ProtectedRoute>
    ),
  },
  {
    path: "/auth/find-club",
    element: (
      <ProtectedRoute 
        condition={AuthService.isAuthenticated() && AuthService.isPersonalInfoSet() && !AuthService.isUserClubsSet()} 
        redirectTo="/auth/personal-info"
      >
        <FindClubOption />
      </ProtectedRoute>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute 
        condition={AuthService.isAuthenticated() && AuthService.isPersonalInfoSet() && AuthService.isUserClubsSet()} 
        redirectTo="/auth/login"
      >
        <DataLoader>
          <MainLayout />
        </DataLoader>
      </ProtectedRoute>
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
    v7_relativeSplatPath: true
  }
});

function App() {
  return (
    <RouterProvider router={router}>
      <ErrorBoundary>
        <MobileProvider>
          <NotificationContainer />
        </MobileProvider>
      </ErrorBoundary>
    </RouterProvider>
  );
}

export default App;