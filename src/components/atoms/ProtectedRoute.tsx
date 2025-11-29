import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn } = useUser();
  const location = useLocation();

  if (!isLoggedIn) {
    // Redirect to login page with return URL
    return <Navigate to="/auth/login/email" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

