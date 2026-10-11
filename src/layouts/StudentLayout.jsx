import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';

/**
 * StudentLayout
 * Minimal top bar. Strictly NO StudentContext or FavouritesContext.
 */
export function StudentLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-14 overflow-x-hidden min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
