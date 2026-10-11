import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { StudentProvider } from '../context/StudentContext';
import { FavouritesProvider, useFavourites } from '../context/FavouritesContext';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileDrawer } from './MobileDrawer';

function TeacherLayoutInner() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { favouritesCount } = useFavourites();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header 
        onMenuClick={() => setIsDrawerOpen(true)} 
        favouritesCount={favouritesCount} 
      />

      <div className="flex-1 flex pt-14">
        <Sidebar favouritesCount={favouritesCount} />
        <MobileDrawer 
          isOpen={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
          favouritesCount={favouritesCount} 
        />

        <main className="flex-1 overflow-x-hidden min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function TeacherLayout() {
  return (
    <StudentProvider>
      <FavouritesProvider>
        <TeacherLayoutInner />
      </FavouritesProvider>
    </StudentProvider>
  );
}
