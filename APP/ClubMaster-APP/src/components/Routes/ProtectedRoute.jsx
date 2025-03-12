import { Navigate, useLocation } from 'react-router-dom';
import AuthService from '../../js/authService';

function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!AuthService.isAuthenticated()) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (!AuthService.isPersonalInfoSet()) {
    return <Navigate to="/auth/personal-info" state={{ from: location }} replace />;
  }

  if (!AuthService.isUserClubsSet()) {
    return <Navigate to="/auth/find-club" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;