import React from 'react';
import { CornerMarkers } from '../ui/CornerMarkers';
import { Heart, Mail, UserPlus, CheckCircle, KeyRound } from 'lucide-react';

/**
 * WorkflowPreview
 * Pure CSS/React mock UI for each step (zero stock photos).
 */
export function WorkflowPreview({ stepId }) {
  if (stepId === '01') {
    // Step 01: Mini Add Student Form Mockup
    return (
      <div className="w-full bg-surface border-hairline border-border p-6 relative space-y-4" style={{ borderRadius: '2px' }}>
        <CornerMarkers size={8} />
        <div className="flex items-center justify-between border-b border-border pb-2">
          <span className="font-mono text-[9px] uppercase tracking-widest text-muted">TERMINAL // ADD_STUDENT</span>
          <span className="w-2 h-2 bg-primary" />
        </div>

        <div className="space-y-3 font-mono text-[11px]">
          <div>
            <div className="text-[9px] text-muted uppercase">GMAIL ADDRESS</div>
            <div className="p-2 border-hairline border-border bg-background text-foreground mt-1">
              maya.lin@gmail.com
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-[9px] text-muted uppercase">ROLL NUMBER</div>
              <div className="p-2 border-hairline border-border bg-background text-foreground mt-1">
                CS-2026-002
              </div>
            </div>
            <div>
              <div className="text-[9px] text-muted uppercase">DEPARTMENT</div>
              <div className="p-2 border-hairline border-border bg-background text-foreground mt-1">
                Comp Science
              </div>
            </div>
          </div>

          <div className="pt-2">
            <div className="p-2 bg-primary text-[var(--color-primary-text)] text-center text-[10px] font-bold uppercase tracking-widest">
              DISPATCH CREDENTIALS
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stepId === '02') {
    // Step 02: Mini Plain Mono Invitation Email Mockup
    return (
      <div className="w-full bg-surface border-hairline border-border p-6 relative space-y-4" style={{ borderRadius: '2px' }}>
        <CornerMarkers size={8} />
        <div className="flex items-center justify-between border-b border-border pb-2">
          <span className="font-mono text-[9px] uppercase tracking-widest text-muted">MAILBOX // DISPATCHED_KEY</span>
          <Mail className="w-3.5 h-3.5 text-[var(--color-accent-gold)]" />
        </div>

        <div className="space-y-2 font-mono text-[11px] bg-background p-4 border-hairline border-border" style={{ borderRadius: '2px' }}>
          <div className="text-muted text-[10px]">TO: maya.lin@gmail.com</div>
          <div className="text-muted text-[10px]">FROM: instructor@fsl.demo</div>
          <div className="text-foreground text-[10px] font-bold border-b border-border pb-2">
            SUBJECT: Institutional Invitation Key
          </div>
          <div className="pt-1 text-muted text-[10px]">
            TEMPORARY SECURITY PASSKEY:
          </div>
          <div className="p-2 bg-surface border-hairline border-border font-bold text-primary text-center">
            TMP-MY92-4410
          </div>
          <div className="text-[9px] text-muted pt-1">
            * Mandatory permanent password update enforced on initial login.
          </div>
        </div>
      </div>
    );
  }

  // Step 03: Mini Favourites Roster Mockup
  return (
    <div className="w-full bg-surface border-hairline border-border p-6 relative space-y-4" style={{ borderRadius: '2px' }}>
      <CornerMarkers size={8} />
      <div className="flex items-center justify-between border-b border-border pb-2">
        <span className="font-mono text-[9px] uppercase tracking-widest text-muted">TERMINAL // PRIVATE_FAVOURITES</span>
        <Heart className="w-3.5 h-3.5 text-[var(--color-accent-coral)] fill-[var(--color-accent-coral)]" />
      </div>

      <div className="space-y-2 font-mono text-[11px]">
        <div className="p-2.5 border-hairline border-border bg-background flex items-center justify-between">
          <div>
            <div className="text-foreground font-bold">Alex Turner</div>
            <div className="text-[9px] text-muted">CS-2026-001 • YEAR 4</div>
          </div>
          <Heart className="w-4 h-4 text-primary fill-primary" />
        </div>

        <div className="p-2.5 border-hairline border-border bg-background flex items-center justify-between">
          <div>
            <div className="text-foreground font-bold">Elena Rostova</div>
            <div className="text-[9px] text-muted">CS-2026-019 • YEAR 4</div>
          </div>
          <Heart className="w-4 h-4 text-primary fill-primary" />
        </div>

        <div className="p-2.5 border-hairline border-border bg-background flex items-center justify-between">
          <div>
            <div className="text-foreground font-bold">Zara Patel</div>
            <div className="text-[9px] text-muted">CS-2026-031 • YEAR 2</div>
          </div>
          <Heart className="w-4 h-4 text-primary fill-primary" />
        </div>
      </div>
    </div>
  );
}
