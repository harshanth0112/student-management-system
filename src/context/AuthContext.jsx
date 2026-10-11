import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const logout = useCallback((reason = null) => {
    authService.logout();
    dispatch({ type: 'LOGOUT' });
    if (reason === 'session_expired') {
      toast.error('Session expired due to 15 minutes of inactivity. Please log in again.');
    } else if (reason) {
      toast.success('Logged out successfully.');
    }
  }, []);

  // Initialize session on mount
  useEffect(() => {
    const session = authService.getCurrentSession();
    if (session) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: session });
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }

    // Inactivity heartbeat checker (runs every 60s)
    const interval = setInterval(() => {
      const activeSession = authService.getCurrentSession();
      if (!activeSession && state.isAuthenticated) {
        logout('session_expired');
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [logout, state.isAuthenticated]);

  // Keep alive session on user activity
  useEffect(() => {
    if (!state.isAuthenticated) return;

    const handleActivity = () => {
      authService.refreshSessionActivity();
    };

    window.addEventListener('click', handleActivity, { passive: true });
    window.addEventListener('keydown', handleActivity, { passive: true });

    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, [state.isAuthenticated]);

  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const user = await authService.login(email, password);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      toast.success(`Welcome back, ${user.name}`);
      return user;
    } catch (err) {
      dispatch({ type: 'LOGIN_FAILURE', payload: err.message });
      toast.error(err.message || 'Login failed');
      throw err;
    }
  };

  const forceChangePassword = async (newPassword) => {
    if (!state.user?.studentId && !state.user?.id) return;
    const targetId = state.user.studentId || state.user.id;
    try {
      await authService.forceChangePassword(targetId, newPassword);
      dispatch({
        type: 'UPDATE_USER',
        payload: { isFirstLogin: false },
      });
      toast.success('Password established successfully.');
    } catch (err) {
      toast.error(err.message || 'Failed to update password');
      throw err;
    }
  };

  const updateStudentProfile = async ({ phone, bio }) => {
    if (!state.user?.studentId && !state.user?.id) return;
    const targetId = state.user.studentId || state.user.id;
    try {
      const updated = await authService.updateStudentProfile(targetId, { phone, bio });
      dispatch({
        type: 'UPDATE_USER',
        payload: { phone: updated.phone, bio: updated.bio },
      });
      toast.success('Profile updated successfully.');
      return updated;
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
      throw err;
    }
  };

  const value = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login,
    logout,
    forceChangePassword,
    updateStudentProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
