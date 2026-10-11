import React, { Suspense } from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from './components/ui/Toast';
import { GridBackground } from './components/ui/GridBackground';
import { ScanLoader } from './components/ui/ScanLoader';
import { ErrorBoundary } from './layouts/ErrorBoundary';
import { routeConfig } from './routes/routeConfig';

function RouteRenderer() {
  const element = useRoutes(routeConfig);
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-4">
          <div className="w-48">
            <ScanLoader variant="primary" />
          </div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
            RESOLVING BLUEPRINT MODULE...
          </div>
        </div>
      }
    >
      {element}
    </Suspense>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <GridBackground />
            <ToastContainer />
            <RouteRenderer />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
