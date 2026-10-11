import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, CornerMarkers } from '../../components/ui';
import { ROUTES } from '../../constants/routes';
import { Compass, ArrowLeft, Home, RotateCcw } from 'lucide-react';

const SCAN_STEPS = [
  'LOADING ROUTING MANIFEST...',
  'RESOLVING ENDPOINT COORDINATES...',
  'CROSS-REFERENCING BLUEPRINT...',
  'NO MATCH FOUND // 404',
];

export default function NotFound() {
  const location = useLocation();
  const navigate = useNavigate();
  const [scanStep, setScanStep] = useState(0);
  const [done, setDone] = useState(false);

  // Animate scan steps on mount
  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step >= SCAN_STEPS.length) {
        clearInterval(interval);
        setDone(true);
      } else {
        setScanStep(step);
      }
    }, 420);
    return () => clearInterval(interval);
  }, []);

  const canGoBack = window.history.length > 1;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground">
      <div
        className="max-w-lg w-full border-hairline border-border bg-surface relative"
        style={{ borderRadius: '2px' }}
      >
        <CornerMarkers size={12} strokeWidth={2} />

        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-border font-mono text-[9px] uppercase tracking-widest text-muted">
          <span>SYS.ROUTER // MANIFEST LOOKUP</span>
          <span className="text-[var(--color-danger)] font-bold">STATUS 404</span>
        </div>

        {/* Body */}
        <div className="p-8 sm:p-10 space-y-7 text-center">
          {/* Icon */}
          <div
            className="w-14 h-14 mx-auto border-hairline border-[var(--color-danger)]/40 bg-background flex items-center justify-center text-[var(--color-danger)]"
            style={{ borderRadius: '2px' }}
          >
            <Compass className="w-7 h-7 stroke-[1.5]" />
          </div>

          {/* Title block */}
          <div className="space-y-2">
            <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-danger)] font-bold">
              STATUS 404 // NOT_FOUND
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Endpoint Unresolved
            </h1>
            <p className="font-sans text-sm text-muted leading-relaxed">
              The requested blueprint coordinate does not exist in the routing manifest.
            </p>
          </div>

          {/* Scan terminal */}
          <div
            className="text-left bg-background border-hairline border-border p-4 font-mono text-[10px] space-y-1.5"
            style={{ borderRadius: '2px' }}
          >
            <div className="text-muted uppercase tracking-widest mb-2 text-[9px]">
              DIAGNOSTIC LOG
            </div>
            {SCAN_STEPS.map((step, i) => (
              <div
                key={step}
                className={`flex items-center gap-2 transition-opacity duration-300 ${
                  i <= scanStep ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 shrink-0 ${
                    i === SCAN_STEPS.length - 1
                      ? 'bg-[var(--color-danger)]'
                      : 'bg-primary'
                  }`}
                />
                <span
                  className={
                    i === SCAN_STEPS.length - 1
                      ? 'text-[var(--color-danger)]'
                      : 'text-muted'
                  }
                >
                  {step}
                </span>
              </div>
            ))}

            {done && (
              <div className="pt-2 text-muted text-[9px] border-t border-border/50 mt-1">
                FAILED_PATH: <span className="text-foreground">{location.pathname}</span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            {canGoBack && (
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                GO BACK
              </Button>
            )}
            <Link to={ROUTES.HOME} className="w-full">
              <Button variant="primary" className="w-full flex items-center justify-center gap-2">
                <Home className="w-3.5 h-3.5" />
                HOME
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => window.location.reload()}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              RETRY
            </Button>
          </div>
        </div>

        {/* Footer bar */}
        <div className="flex items-center justify-between px-6 py-2.5 border-t border-border font-mono text-[9px] uppercase tracking-widest text-muted">
          <span>ROUTING MANIFEST // NULL_REF</span>
          <span>NODE: UNRESOLVED</span>
        </div>
      </div>
    </div>
  );
}
