import React from 'react';
import { Link } from 'react-router-dom';
import { Button, CornerMarkers } from '../../components/ui';
import { ROUTES } from '../../constants/routes';
import { ShieldAlert } from 'lucide-react';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground">
      <div className="max-w-md w-full border-hairline border-border p-8 sm:p-10 bg-surface relative text-center space-y-6" style={{ borderRadius: '2px' }}>
        <CornerMarkers size={12} strokeWidth={2} />

        <div className="w-12 h-12 mx-auto border-hairline border-border bg-background flex items-center justify-center text-[var(--color-danger)]" style={{ borderRadius: '2px' }}>
          <ShieldAlert className="w-6 h-6 stroke-[1.5]" />
        </div>

        <div className="space-y-2">
          <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-danger)] font-bold">
            STATUS 403 // FORBIDDEN
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Access Restricted
          </h1>
          <p className="font-sans text-sm text-muted leading-relaxed">
            Your active role lacks cryptographic clearance to inspect this directory endpoint.
          </p>
        </div>

        <div className="pt-2">
          <Link to={ROUTES.HOME} className="w-full block">
            <Button variant="primary" className="w-full">
              RETURN TO SAFETY
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
