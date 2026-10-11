import React, { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { 
  Container,
  Section,
  Button, 
  Input, 
  Select, 
  Modal, 
  ConfirmDialog, 
  Badge, 
  Skeleton, 
  EmptyState, 
  Pagination, 
  Avatar, 
  StatCard, 
  ScanLoader, 
  WordReveal,
  CornerMarkers,
  NetworkTopologyGraph
} from '../../components/ui';
import { 
  Users, 
  Heart, 
  Mail, 
  Sun, 
  Moon, 
  Sparkles,
  Terminal,
  Layers,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function DesignPreview() {
  const { theme, toggleTheme } = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');

  const triggerToast = (type) => {
    if (type === 'success') toast.success('Student record saved successfully');
    else if (type === 'error') toast.error('Failed to validate student email');
    else toast('System telemetry logged');
  };

  return (
    <div className="min-h-screen">
      {/* Blueprint Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-sm border-b border-hairline border-border h-14">
        <Container className="h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Square logo box (32x32px) in #1A3C2B / dark mint */}
            <div className="w-8 h-8 bg-primary flex items-center justify-center text-[var(--color-primary-text)] font-mono text-xs font-bold" style={{ borderRadius: '2px' }}>
              FS
            </div>
            <span className="font-display font-bold text-sm tracking-tight text-foreground">
              FAVOURITE STUDENT LIST
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 font-mono text-[10px] uppercase tracking-widest text-muted">
            <span className="text-foreground hover:text-primary transition-colors cursor-pointer">01. ROSTER</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">02. FAVOURITES</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">03. INVITATIONS</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">04. TELEMETRY</span>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={() => triggerToast('success')}>
              TEST TOAST
            </Button>
          </div>
        </Container>
      </header>

      {/* Hero Section with Network Topology Graph */}
      <Section className="pt-24 pb-16 border-b border-border">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 border-hairline border-border bg-surface font-mono text-[10px] uppercase tracking-widest text-muted" style={{ borderRadius: '2px' }}>
              <span className="w-2 h-2 bg-primary" />
              <span>SPEC // TECHNICAL BLUEPRINT SYSTEM</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-foreground leading-[0.95]">
              Structural precision. <br />
              <span className="text-primary font-bold">Role-enforced control.</span>
            </h1>

            <div className="flex items-start gap-3 pl-3 border-l-2 border-primary">
              <p className="font-mono text-xs uppercase tracking-widest text-muted leading-relaxed max-w-xl">
                SYS.ARCH: INVITE-ONLY STUDENT DIRECTORY. TEACHERS ISOLATE ROSTERS; STUDENTS ACCESS ONLY PRIVATE RECORDS. ZERO SHADOWS, 1PX DIVIDERS, AND BLUEPRINT PRECISION.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button variant="primary">
                01. ACCESS PORTAL
              </Button>
              <Button variant="outline" onClick={() => setModalOpen(true)}>
                02. PREVIEW EMAIL
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <NetworkTopologyGraph />
          </div>
        </div>
      </Section>

      {/* Bento Feature Grid with Color Left-Border Chips */}
      <Section divider>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted">
            01 / Bento Telemetry & Stat Grid (1px Hairlines, Colored Accents)
          </h2>
          <span className="font-mono text-[9px] text-muted uppercase">GAP: 1PX • BORDER-RADIUS: 2PX</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Users}
            value="25"
            label="Enrolled Students"
            caption="SYS.DIR"
            accentColor="forest"
          />
          <StatCard
            icon={Sparkles}
            value="19"
            label="Active Accounts"
            caption="AUTH.200"
            accentColor="mint"
          />
          <StatCard
            icon={Mail}
            value="04"
            label="Pending Invites"
            caption="OUTBOX.TMP"
            accentColor="gold"
          />
          <StatCard
            icon={Heart}
            value="06"
            label="Saved Favourites"
            caption="PRI.ROSTER"
            accentColor="coral"
          />
        </div>
      </Section>

      {/* Typography: Space Grotesk, General Sans, JetBrains Mono */}
      <Section divider>
        <div className="mb-6">
          <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted">
            02 / Typography Triad (Space Grotesk, General Sans, JetBrains Mono)
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="border-hairline border-border p-6 bg-surface relative" style={{ borderRadius: '2px' }}>
            <CornerMarkers size={8} />
            <div className="font-mono text-[10px] text-muted uppercase tracking-widest mb-3">
              Space Grotesk (Headers / Display)
            </div>
            <div className="font-display text-3xl font-bold tracking-tight text-foreground mb-1">
              Know your class.
            </div>
            <div className="font-display text-xl font-bold text-primary tracking-tight">
              Keep your favourites.
            </div>
            <p className="font-mono text-[10px] text-muted mt-4">
              DISPLAY HEADERS. font-weight: 700, tight tracking -0.03em.
            </p>
          </div>

          <div className="border-hairline border-border p-6 bg-surface relative" style={{ borderRadius: '2px' }}>
            <CornerMarkers size={8} />
            <div className="font-mono text-[10px] text-muted uppercase tracking-widest mb-3">
              General Sans (Body & Form Values)
            </div>
            <p className="font-sans text-sm text-foreground/90 leading-relaxed mb-2">
              High-legibility geometric sans-serif loaded from Fontshare with swap fallback. Handles dense roster rows and announcements.
            </p>
            <p className="font-mono text-[10px] text-muted mt-4">
              BODY COPY. font-sans: General Sans, Inter, system-ui.
            </p>
          </div>

          <div className="border-hairline border-border p-6 bg-surface relative" style={{ borderRadius: '2px' }}>
            <CornerMarkers size={8} />
            <div className="font-mono text-[10px] text-muted uppercase tracking-widest mb-3">
              JetBrains Mono (Metadata & Codes)
            </div>
            <div className="font-mono text-xs tracking-widest uppercase text-foreground mb-1">
              ROLL_ID: CS-2026-089
            </div>
            <div className="font-mono text-[11px] tracking-wide text-primary">
              INVITE_HASH: REQ-AK89-X01
            </div>
            <p className="font-mono text-[10px] text-muted mt-4">
              METADATA. JetBrains Mono for all tags, buttons, roll numbers.
            </p>
          </div>
        </div>
      </Section>

      {/* Status Badges with 8px Square Dots */}
      <Section divider>
        <div className="mb-6">
          <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted">
            03 / Status Badges (8px Square Dot, JetBrains Mono, WCAG AA Compliant)
          </h2>
        </div>

        <div className="border-hairline border-border p-6 bg-surface flex flex-wrap items-center gap-4" style={{ borderRadius: '2px' }}>
          <Badge variant="active">ACTIVE</Badge>
          <Badge variant="invited">INVITED</Badge>
          <Badge variant="disabled">DISABLED</Badge>
          <Badge variant="danger">DANGER</Badge>
          <Badge variant="neutral">TEACHER</Badge>
          <Badge variant="default">STUDENT</Badge>
        </div>
      </Section>

      {/* Technical Form CTA with 4 L-shaped Corner Markers */}
      <Section divider>
        <div className="mb-6">
          <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted">
            04 / Technical Form CTA (640px Max Width with 4 Corner Markers)
          </h2>
        </div>

        <div className="max-w-[640px] mx-auto border-hairline border-border bg-surface p-8 sm:p-10 relative" style={{ borderRadius: '2px' }}>
          <CornerMarkers size={12} strokeWidth={2} />

          <div className="mb-6">
            <h3 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Request Student Access
            </h3>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted mt-1">
              INPUTS USE SOLID SURFACE AND 1PX HAIRLINE BORDERS
            </p>
          </div>

          <div className="space-y-5">
            <Input
              label="Student Gmail"
              required
              placeholder="student@gmail.com"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (e.target.value && !e.target.value.endsWith('@gmail.com')) {
                  setInputError('Must end with @gmail.com');
                } else {
                  setInputError('');
                }
              }}
              error={inputError}
              helperText="Enforces valid @gmail.com address"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                placeholder="Marcus Vance"
                defaultValue="Marcus Vance"
              />
              <Select
                label="Department"
                required
                options={[
                  { value: 'cs', label: 'Computer Science' },
                  { value: 'ee', label: 'Electrical Engineering' },
                  { value: 'me', label: 'Mechanical Engineering' },
                  { value: 'math', label: 'Mathematics' },
                ]}
              />
            </div>

            <div className="pt-2">
              <Button variant="primary" className="w-full">
                SUBMIT ACCESS REQUEST
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Motion: WordReveal & ScanLoader */}
      <Section divider>
        <div className="mb-6">
          <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted">
            05 / Snappy Motion & ScanLoader
          </h2>
        </div>

        <div className="border-hairline border-border p-8 bg-surface space-y-6" style={{ borderRadius: '2px' }}>
          <div className="space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
              ScanLoader (2px Linear Slide)
            </div>
            <ScanLoader variant="primary" />
          </div>

          <div className="pt-6 border-t border-border">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted mb-3">
              WordReveal (Space Grotesk Heading, Reduced-Motion Safe)
            </div>
            <WordReveal
              as="h2"
              className="text-2xl sm:text-3xl text-foreground font-bold tracking-tight leading-snug"
              text="Students never see each other. Favourites stay with the teacher. Every account begins with an invitation."
              emphasisWord="Favourites"
            />
          </div>
        </div>
      </Section>

      {/* Empty State & Modals */}
      <Section className="pb-24">
        <div className="mb-6">
          <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted">
            06 / EmptyState & Dialogs (Corner Markers, Exact Text)
          </h2>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <Button variant="outline" onClick={() => setModalOpen(true)}>
            OPEN BLUEPRINT MODAL
          </Button>
          <Button variant="danger" onClick={() => setConfirmOpen(true)}>
            OPEN CONFIRM DIALOG
          </Button>
        </div>

        <EmptyState
          icon={Heart}
          title="No favourite students added yet"
          description="Click the heart toggle next to any student in the roster to save them to your private list."
          actionLabel="VIEW STUDENT ROSTER"
          onAction={() => triggerToast('info')}
          className="mb-8"
        />

        <Pagination
          currentPage={page}
          totalPages={4}
          totalItems={25}
          pageSize={8}
          onPageChange={setPage}
        />
      </Section>

      {/* Modal Demo */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Simulated Invitation"
        subtitle="STUDENT CREDENTIAL DISPATCH // TMP.KEY"
      >
        <div className="space-y-4 font-mono text-xs">
          <div className="p-4 border-hairline border-border bg-background space-y-1.5" style={{ borderRadius: '2px' }}>
            <div>TO: student@gmail.com</div>
            <div>FROM: instructor@fsl.demo</div>
            <div>STATUS: INVITED [ROLE: STUDENT]</div>
            <div className="pt-2 border-t border-border text-muted">
              TEMP PASSWORD: <span className="text-primary font-bold">TMP-AK92-8812</span>
            </div>
          </div>
          <div className="flex justify-end pt-3">
            <Button variant="primary" size="sm" onClick={() => setModalOpen(false)}>
              ACKNOWLEDGE
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          toast.error('Student deleted');
        }}
        title="Delete Student Record"
        message="Are you sure you want to permanently delete this student? They will also be removed from your favourites."
        confirmText="DELETE RECORD"
      />
    </div>
  );
}
