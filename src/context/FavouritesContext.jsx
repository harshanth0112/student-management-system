import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { favouritesService } from '../services/favouritesService';
import { storageService } from '../services/storageService';
import { STORAGE_KEYS } from '../constants/storageKeys';
import toast from 'react-hot-toast';

const FavouritesContext = createContext();

const initialState = {
  favouriteIds: [],
  isLoading: true,
};

function favouritesReducer(state, action) {
  switch (action.type) {
    case 'SET_FAVOURITES':
      return { ...state, favouriteIds: action.payload, isLoading: false };
    default:
      return state;
  }
}

/**
 * FavouritesProvider
 * Centralized reactive store for teacher bookmark favourites.
 * Subscribes to storageService events so changes propagate everywhere instantly.
 */
export function FavouritesProvider({ children }) {
  const [state, dispatch] = useReducer(favouritesReducer, initialState);

  const fetchFavourites = useCallback(async () => {
    try {
      const data = await favouritesService.getFavourites();
      dispatch({ type: 'SET_FAVOURITES', payload: data });
    } catch {
      toast.error('Failed to load favourites list');
    }
  }, []);

  useEffect(() => {
    fetchFavourites();

    // Centralized store listener: if favourites change anywhere, sync immediately
    const unsubscribe = storageService.subscribe((key, value) => {
      if (key === STORAGE_KEYS.FAVOURITES || key === '*') {
        if (value && Array.isArray(value)) {
          dispatch({ type: 'SET_FAVOURITES', payload: value });
        } else {
          fetchFavourites();
        }
      }
    });

    return unsubscribe;
  }, [fetchFavourites]);

  const toggleFavourite = async (studentId) => {
    try {
      const updated = await favouritesService.toggleFavourite(studentId);
      dispatch({ type: 'SET_FAVOURITES', payload: updated });
      return updated;
    } catch {
      toast.error('Failed to update favourite status');
    }
  };

  const clearAllFavourites = async () => {
    try {
      await favouritesService.clearAllFavourites();
      dispatch({ type: 'SET_FAVOURITES', payload: [] });
      toast.success('All favourites cleared');
    } catch {
      toast.error('Failed to clear favourites');
    }
  };

  const isFavourite = useCallback(
    (studentId) => state.favouriteIds.includes(studentId),
    [state.favouriteIds]
  );

  const value = useMemo(
    () => ({
      favouriteIds: state.favouriteIds,
      favouritesCount: state.favouriteIds.length,
      isLoading: state.isLoading,
      toggleFavourite,
      clearAllFavourites,
      isFavourite,
    }),
    [state.favouriteIds, state.isLoading, isFavourite]
  );

  return <FavouritesContext.Provider value={value}>{children}</FavouritesContext.Provider>;
}

export function useFavourites() {
  const context = useContext(FavouritesContext);
  if (!context) {
    throw new Error('useFavourites must be used within a FavouritesProvider (Teacher context only)');
  }
  return context;
}
