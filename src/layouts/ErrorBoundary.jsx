import React, { Component } from 'react';
import { Button } from '../components/ui/Button';

/**
 * Detects Vite chunk-load failures that happen when Render (or any CDN)
 * redeploys and old hashed filenames no longer exist.
 * Strategy: auto-reload once per session; if it still fails, show the error UI.
 */
const CHUNK_RELOAD_KEY = '__chunk_reload_attempted__';

function isChunkError(error) {
  if (!error) return false;
  const msg = error.message || String(error);
  return (
    msg.includes('Failed to fetch dynamically imported module') ||
    msg.includes('Importing a module script failed') ||
    msg.includes('ChunkLoadError') ||
    error.name === 'ChunkLoadError'
  );
}

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Auto-reload once for stale chunk errors (happens after Render redeploy)
    if (isChunkError(error)) {
      const alreadyAttempted = sessionStorage.getItem(CHUNK_RELOAD_KEY);
      if (!alreadyAttempted) {
        sessionStorage.setItem(CHUNK_RELOAD_KEY, '1');
        window.location.reload();
        // Return a non-error state while reload is in-flight
        return { hasError: false, error: null };
      }
    }
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (!isChunkError(error)) {
      console.error('Uncaught application error:', error, errorInfo);
    }
  }

  componentDidUpdate() {
    // Clear the reload flag once the app recovers successfully
    if (!this.state.hasError) {
      sessionStorage.removeItem(CHUNK_RELOAD_KEY);
    }
  }

  handleReload = () => {
    sessionStorage.removeItem(CHUNK_RELOAD_KEY);
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground">
          <div className="max-w-md w-full border-hairline border-border p-8 bg-surface space-y-6 text-center" style={{ borderRadius: '2px' }}>
            <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-danger)]">
              ERR // APPLICATION_HALTED
            </div>
            
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
              Unexpected Runtime Error
            </h1>

            <p className="font-sans text-sm text-muted leading-relaxed">
              An unexpected client-side exception occurred. The error boundary intercepted the failure.
            </p>

            {this.state.error && (
              <div className="text-left bg-background p-3 border-hairline border-[var(--color-danger)]/30 font-mono text-xs text-[var(--color-danger)] overflow-x-auto max-h-48 whitespace-pre-wrap" style={{ borderRadius: '2px' }}>
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Button variant="outline" onClick={() => { localStorage.clear(); window.location.href = '/login'; }} className="w-full">
                RESET LOCAL STORAGE
              </Button>
              <Button variant="primary" onClick={this.handleReload} className="w-full">
                RELOAD APPLICATION
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
