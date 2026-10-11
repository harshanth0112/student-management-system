import React, { useState } from 'react';
import { PublicNav } from '../../components/landing/PublicNav';
import { Hero } from '../../components/landing/Hero';
import { WorkflowSteps } from '../../components/landing/WorkflowSteps';
import { BentoTelemetryGrid } from '../../components/landing/BentoTelemetryGrid';
import { UseCaseTabs } from '../../components/landing/UseCaseTabs';
import { RequestAccessForm } from '../../components/landing/RequestAccessForm';
import { NetworkTopologyGraph } from '../../components/ui/NetworkTopologyGraph';
import { Container } from '../../components/ui/Container';
import { Modal } from '../../components/ui/Modal';
import { CornerMarkers } from '../../components/ui/CornerMarkers';
import { useActiveSection } from '../../hooks/useActiveSection';
import { landingContent } from '../../data/landingContent';
import { Copy, Check, ExternalLink } from 'lucide-react';

export default function Landing() {
  const [credentialsOpen, setCredentialsOpen] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const activeSection = useActiveSection(['how-it-works', 'roles', 'topology', 'request-access']);

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1800);
    });
  };

  const credentials = [
    {
      role: 'TEACHER',
      label: 'Dr. Evelyn Reed',
      email: 'evelyn.reed@gmail.com',
      password: 'password123',
      access: 'Full roster management, favourites, invitations, analytics',
    },
    {
      role: 'STUDENT',
      label: 'Alex Turner (Active)',
      email: 'alex.turner@gmail.com',
      password: 'password123',
      access: 'Own profile view, announcements, no roster access',
    },
    {
      role: 'STUDENT (FIRST LOGIN)',
      label: 'Maya Lin (Invited)',
      email: 'maya.lin@gmail.com',
      password: 'TMP-MY92-4410',
      access: 'Force password change → Student dashboard',
    },
  ];

  return (
    <>
      <PublicNav activeSection={activeSection} />

      {/* Hero Section */}
      <Hero onOpenCredentialsModal={() => setCredentialsOpen(true)} />

      {/* How It Works: Workflow Steps */}
      <WorkflowSteps />

      {/* Live Bento Telemetry Grid */}
      <BentoTelemetryGrid />

      {/* Role Segregation Tabs */}
      <UseCaseTabs />

      {/* Network Topology Graph Section */}
      <section id="topology" className="py-20 border-b border-hairline border-border">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
                SYS.ARCH // TOPOLOGY VISUALIZATION
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Role Boundary Graph
              </h2>
              <p className="font-sans text-sm text-muted leading-relaxed">
                Architectural visualization of strict separation between Teacher and Student directory nodes.
                The central hub represents the authentication gateway — all data flows are role-gated and
                context-isolated.
              </p>

              <div className="space-y-3 pt-4">
                {[
                  { color: 'var(--color-accent-coral)', label: 'TEACHER NODE', desc: 'Full roster and favourites access' },
                  { color: 'var(--color-accent-mint)', label: 'STUDENT NODE', desc: 'Own-profile isolation boundary' },
                  { color: 'var(--color-accent-gold)', label: 'AUTH GATEWAY', desc: 'Role-based routing controller' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <span
                      className="w-3 h-3 mt-0.5 shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-widest text-foreground font-bold">
                        {item.label}
                      </div>
                      <div className="font-sans text-xs text-muted">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7">
              <NetworkTopologyGraph />
            </div>
          </div>
        </Container>
      </section>

      {/* Request Access Form with Corner Markers */}
      <RequestAccessForm />

      {/* Footer */}
      <footer className="py-10 border-t border-hairline border-border">
        <Container>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-6 h-6 bg-primary flex items-center justify-center text-[var(--color-primary-text)] font-mono text-[8px] font-bold select-none"
                style={{ borderRadius: '2px' }}
              >
                FS
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
                FAVOURITE STUDENT LIST
              </span>
            </div>

            <p className="font-mono text-[9px] uppercase tracking-widest text-muted text-center sm:text-right max-w-lg leading-relaxed">
              {landingContent.footer.disclaimer}
            </p>
          </div>
        </Container>
      </footer>

      {/* Demo Credentials Modal */}
      <Modal
        isOpen={credentialsOpen}
        onClose={() => setCredentialsOpen(false)}
        title="Demo Credentials"
        subtitle="SIMULATED AUTH // USE THESE TO EXPLORE THE PROTOTYPE"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          {credentials.map((cred, i) => (
            <div
              key={i}
              className="relative border-hairline border-border bg-background p-5 space-y-3"
              style={{ borderRadius: '2px' }}
            >
              <CornerMarkers size={8} strokeWidth={1.5} />

              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary shrink-0" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">
                  {cred.role}
                </span>
                <span className="font-sans text-xs text-muted ml-auto">
                  {cred.label}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex items-center gap-2 bg-surface px-3 py-2 border-hairline border-border" style={{ borderRadius: '2px' }}>
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-[9px] uppercase tracking-widest text-muted mb-0.5">EMAIL</div>
                    <div className="font-mono text-xs text-foreground truncate">{cred.email}</div>
                  </div>
                  <button
                    onClick={() => handleCopy(cred.email, `email-${i}`)}
                    className="p-1 text-muted hover:text-foreground transition-colors shrink-0"
                    title="Copy email"
                  >
                    {copiedField === `email-${i}` ? (
                      <Check className="w-3.5 h-3.5 text-primary" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2 bg-surface px-3 py-2 border-hairline border-border" style={{ borderRadius: '2px' }}>
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-[9px] uppercase tracking-widest text-muted mb-0.5">PASSWORD</div>
                    <div className="font-mono text-xs text-foreground truncate">{cred.password}</div>
                  </div>
                  <button
                    onClick={() => handleCopy(cred.password, `pass-${i}`)}
                    className="p-1 text-muted hover:text-foreground transition-colors shrink-0"
                    title="Copy password"
                  >
                    {copiedField === `pass-${i}` ? (
                      <Check className="w-3.5 h-3.5 text-primary" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="font-mono text-[9px] text-muted uppercase tracking-widest">
                ACCESS: {cred.access}
              </div>
            </div>
          ))}

          <div className="pt-2 font-mono text-[9px] text-center text-muted uppercase tracking-widest">
            ALL CREDENTIALS ARE SIMULATED • LOCALSTORAGE PERSISTENCE ONLY
          </div>
        </div>
      </Modal>
    </>
  );
}
