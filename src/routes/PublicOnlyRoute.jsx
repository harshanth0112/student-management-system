import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';
import { ROLES } from '../constants/roles';

export function PublicOnlyRoute({ children }) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated && user) {
    // If student has pending forced first login, route to force-password-change
    if (user.role === ROLES.STUDENT && user.isFirstLogin) {
      return <Navigate to={ROUTES.STUDENT_FORCE_PASSWORD} replace />;
    }

    const intendedPath = location.state?.from?.pathname;
    if (intendedPath) {
      return <Navigate to={intendedPath} replace />;
    }

    const defaultRedirect = user.role === ROLES.TEACHER 
      ? ROUTES.TEACHER_DASHBOARD 
      : ROUTES.STUDENT_DASHBOARD;

    return <Navigate to={defaultRedirect} replace />;
  }

  return children;
}
