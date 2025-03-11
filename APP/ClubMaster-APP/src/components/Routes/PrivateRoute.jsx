import { Navigate, useLocation } from 'react-router-dom';
import AuthService from '../../js/authService';

function PrivateRoute({ children }) {
  const location = useLocation();

  if (!AuthService.isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default PrivateRoute; 