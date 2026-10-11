import React, { lazy } from 'react';
import { ROUTES } from '../constants/routes';
import { ROLES } from '../constants/roles';

// Guards
import { PublicOnlyRoute } from './PublicOnlyRoute';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';
import { FirstLoginGuard } from './FirstLoginGuard';

// Layouts
import { PublicLayout } from '../layouts/PublicLayout';
import { TeacherLayout } from '../layouts/TeacherLayout';
import { StudentLayout } from '../layouts/StudentLayout';

// Pages (Lazy Loaded for performance & SEO)
const Landing = lazy(() => import('../pages/public/Landing'));
const Login = lazy(() => import('../pages/auth/Login'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const Unauthorized = lazy(() => import('../pages/errors/Unauthorized'));
const NotFound = lazy(() => import('../pages/errors/NotFound'));

// Teacher Pages
const TeacherDashboard = lazy(() => import('../pages/teacher/TeacherDashboard'));
const StudentListPage = lazy(() => import('../pages/teacher/StudentListPage'));
const StudentFormPage = lazy(() => import('../pages/teacher/StudentFormPage'));
const StudentDetailPage = lazy(() => import('../pages/teacher/StudentDetailPage'));
const FavouritesPage = lazy(() => import('../pages/teacher/FavouritesPage'));
const InvitationsPage = lazy(() => import('../pages/teacher/InvitationsPage'));
const ActivityPage = lazy(() => import('../pages/teacher/ActivityPage'));

// Student Pages
const StudentDashboard = lazy(() => import('../pages/student/StudentDashboard'));
const StudentProfile = lazy(() => import('../pages/student/StudentProfile'));
const ForceChangePasswordPage = lazy(() => import('../pages/student/ForceChangePasswordPage'));

export const routeConfig = [
  // Public Routes wrapped in PublicLayout
  {
    element: <PublicLayout />,
    children: [
      {
        path: ROUTES.HOME,
        element: <Landing />,
      },
      {
        path: ROUTES.LOGIN,
        element: (
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        ),
      },
      {
        path: ROUTES.FORGOT_PASSWORD,
        element: (
          <PublicOnlyRoute>
            <ForgotPassword />
          </PublicOnlyRoute>
        ),
      },
      {
        path: ROUTES.UNAUTHORIZED,
        element: <Unauthorized />,
      },
    ],
  },

  // Teacher Protected Routes (Mounted with StudentContext + FavouritesContext)
  {
    path: ROUTES.TEACHER,
    element: (
      <ProtectedRoute>
        <RoleRoute role={ROLES.TEACHER}>
          <TeacherLayout />
        </RoleRoute>
      </ProtectedRoute>
    ),
    children: [
      {
        path: ROUTES.TEACHER_DASHBOARD,
        element: <TeacherDashboard />,
      },
      {
        path: ROUTES.TEACHER_STUDENTS,
        element: <StudentListPage />,
      },
      {
        path: ROUTES.TEACHER_STUDENT_NEW,
        element: <StudentFormPage />,
      },
      {
        path: ROUTES.TEACHER_STUDENT_EDIT,
        element: <StudentFormPage />,
      },
      {
        path: ROUTES.TEACHER_STUDENT_DETAIL,
        element: <StudentDetailPage />,
      },
      {
        path: ROUTES.TEACHER_FAVOURITES,
        element: <FavouritesPage />,
      },
      {
        path: ROUTES.TEACHER_INVITATIONS,
        element: <InvitationsPage />,
      },
      {
        path: ROUTES.TEACHER_ACTIVITY,
        element: <ActivityPage />,
      },
    ],
  },

  // Student Protected Routes (Completely Isolated: NO StudentContext/FavouritesContext)
  {
    path: ROUTES.STUDENT,
    element: (
      <ProtectedRoute>
        <RoleRoute role={ROLES.STUDENT}>
          <StudentLayout />
        </RoleRoute>
      </ProtectedRoute>
    ),
    children: [
      {
        path: ROUTES.STUDENT_FORCE_PASSWORD,
        element: <ForceChangePasswordPage />,
      },
      {
        path: ROUTES.STUDENT_DASHBOARD,
        element: (
          <FirstLoginGuard>
            <StudentDashboard />
          </FirstLoginGuard>
        ),
      },
      {
        path: ROUTES.STUDENT_PROFILE,
        element: (
          <FirstLoginGuard>
            <StudentProfile />
          </FirstLoginGuard>
        ),
      },
    ],
  },

  // 404 Fallback Catch-all
  {
    path: '*',
    element: <NotFound />,
  },
];
