import React, { useEffect, useState } from 'react';
import { Container } from '../ui/Container';
import { landingService } from '../../services/landingService';
import { landingContent } from '../../data/landingContent';
import { Users, Building2, ShieldCheck, Database } from 'lucide-react';

export function BentoTelemetryGrid() {
  const [metrics, setMetrics] = useState({
    studentCount: 25,
    departmentCount: 4,
    roleCount: 2,
  });

  useEffect(() => {
    landingService.getMetrics().then(setMetrics).catch(() => {});
  }, []);

  return (
    <section className="py-16 sm:py-20 border-b border-hairline border-border">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">
              SYS.TELEMETRY // BENTO GRID
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Live Seed Metrics
            </h2>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
            {landingContent.statsCaption}
          </div>
        </div>

        {/* 2x2 Bento Feature Grid with 1px gaps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border p-px border-hairline border-border" style={{ borderRadius: '2px' }}>
          {/* Cell 1: Total Enrolled (Forest Accent) */}
          <div className="bg-background p-8 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 border-hairline border-border flex items-center justify-center text-primary" style={{ borderRadius: '2px' }}>
                <Users className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 border-hairline border-border font-mono text-[9px] uppercase tracking-widest text-muted" style={{ borderRadius: '2px' }}>
                <span className="w-1.5 h-1.5 bg-primary" />
                <span>ROSTER.01</span>
              </div>
            </div>

            <div className="pl-3 border-l-2 border-primary space-y-1">
              <div className="font-display text-5xl sm:text-6xl font-bold text-foreground tracking-tight">
                {metrics.studentCount}
              </div>
              <div className="font-mono text-[11px] uppercase tracking-widest text-muted">
                DEMO STUDENTS ENROLLED
              </div>
            </div>

            <div className="font-mono text-[10px] text-muted leading-relaxed">
              Active candidates distributed across academic sections with encrypted temporary authentication keys.
            </div>
          </div>

          {/* Cell 2: Academic Departments (Mint Accent) */}
          <div className="bg-background p-8 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 border-hairline border-border flex items-center justify-center text-[var(--color-accent-mint)]" style={{ borderRadius: '2px' }}>
                <Building2 className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 border-hairline border-border font-mono text-[9px] uppercase tracking-widest text-muted" style={{ borderRadius: '2px' }}>
                <span className="w-1.5 h-1.5 bg-[var(--color-accent-mint)]" />
                <span>DEPT.02</span>
              </div>
            </div>

            <div className="pl-3 border-l-2 border-[var(--color-accent-mint)] space-y-1">
              <div className="font-display text-5xl sm:text-6xl font-bold text-foreground tracking-tight">
                {metrics.departmentCount}
              </div>
              <div className="font-mono text-[11px] uppercase tracking-widest text-muted">
                ACADEMIC DEPARTMENTS
              </div>
            </div>

            <div className="font-mono text-[10px] text-muted leading-relaxed">
              CS (Computer Science), EE (Electrical), ME (Mechanical), and MATH (Mathematics) isolated rosters.
            </div>
          </div>

          {/* Cell 3: Strictly Separated Roles (Gold Accent) */}
          <div className="bg-background p-8 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 border-hairline border-border flex items-center justify-center text-[var(--color-accent-gold)]" style={{ borderRadius: '2px' }}>
                <ShieldCheck className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 border-hairline border-border font-mono text-[9px] uppercase tracking-widest text-muted" style={{ borderRadius: '2px' }}>
                <span className="w-1.5 h-1.5 bg-[var(--color-accent-gold)]" />
                <span>RBAC.03</span>
              </div>
            </div>

            <div className="pl-3 border-l-2 border-[var(--color-accent-gold)] space-y-1">
              <div className="font-display text-5xl sm:text-6xl font-bold text-foreground tracking-tight">
                02
              </div>
              <div className="font-mono text-[11px] uppercase tracking-widest text-muted">
                STRICTLY SEPARATED ROLES
              </div>
            </div>

            <div className="font-mono text-[10px] text-muted leading-relaxed">
              Teacher vs Student boundaries: student portal completely purges roster querying and favourite context state.
            </div>
          </div>

          {/* Cell 4: Live Activity Telemetry (Coral Accent) */}
          <div className="bg-background p-8 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 border-hairline border-border flex items-center justify-center text-[var(--color-accent-coral)]" style={{ borderRadius: '2px' }}>
                <Database className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 border-hairline border-border font-mono text-[9px] uppercase tracking-widest text-muted" style={{ borderRadius: '2px' }}>
                <span className="w-1.5 h-1.5 bg-[var(--color-accent-coral)]" />
                <span>AUDIT.04</span>
              </div>
            </div>

            <div className="pl-3 border-l-2 border-[var(--color-accent-coral)] space-y-1">
              <div className="font-display text-5xl sm:text-6xl font-bold text-foreground tracking-tight">
                100%
              </div>
              <div className="font-mono text-[11px] uppercase tracking-widest text-muted">
                PERSISTENT LOCAL DISPATCH
              </div>
            </div>

            <div className="font-mono text-[10px] text-muted leading-relaxed">
              Every invitation dispatch, heart toggle, and password establishment updates live simulated localStorage state.
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
