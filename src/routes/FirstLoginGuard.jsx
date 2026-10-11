import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';
import { ROLES } from '../constants/roles';

export function FirstLoginGuard({ children }) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // If user is a student with an uncompleted initial password setup
  if (user?.role === ROLES.STUDENT && user?.isFirstLogin) {
    return <Navigate to={ROUTES.STUDENT_FORCE_PASSWORD} replace />;
  }

  return children;
}
