import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * PublicLayout
 * Wraps Landing, Login, ForgotPassword, and Error pages
 */
export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
