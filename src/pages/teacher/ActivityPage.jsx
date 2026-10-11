import React, { useState, useEffect } from 'react';
import { Section } from '../../components/ui/Section';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { CornerMarkers } from '../../components/ui/CornerMarkers';
import { EmptyState } from '../../components/ui/EmptyState';
import { activityService } from '../../services/activityService';
import { storageService } from '../../services/storageService';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import { formatDate } from '../../utils/formatters';
import { History, RotateCcw, Activity as ActivityIcon, Shield, User, Key, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ActivityPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);

  const fetchActivities = async () => {
    try {
      const data = await activityService.getActivity(100);
      setActivities(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load activity trail');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();

    // Centralized store listener: sync audit trail when activity or data changes
    const unsubscribe = storageService.subscribe((key) => {
      if (key === STORAGE_KEYS.ACTIVITY || key === '*') {
        fetchActivities();
      }
    });

    return unsubscribe;
  }, []);

  const handleResetData = async () => {
    if (!window.confirm('WARNING: Reset all demo data to default mock state? All edits, new enrolments, and activity history will revert.')) {
      return;
    }
    setResetting(true);
    try {
      await activityService.resetDemoData();
      toast.success('Demo environment restored to baseline');
      window.location.reload();
    } catch (err) {
      toast.error('Reset failed');
      setResetting(false);
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'STUDENT_CREATED':
      case 'STUDENT_ENROLLED':
        return <UserCheck className="w-3.5 h-3.5 text-primary" />;
      case 'STUDENT_UPDATED':
        return <User className="w-3.5 h-3.5 text-primary" />;
      case 'INVITATION_RESENT':
      case 'PASSWORD_CHANGED':
        return <Key className="w-3.5 h-3.5 text-[var(--color-accent-gold)]" />;
      case 'STUDENT_DELETED':
      case 'STUDENT_DISABLED':
        return <Shield className="w-3.5 h-3.5 text-[var(--color-danger)]" />;
      default:
        return <ActivityIcon className="w-3.5 h-3.5 text-muted" />;
    }
  };

  if (loading) {
    return (
      <Section className="py-8 space-y-6">
        <Skeleton className="h-10 w-64" style={{ borderRadius: '2px' }} />
        <Skeleton className="h-64" style={{ borderRadius: '2px' }} />
      </Section>
    );
  }

  return (
    <Section className="py-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
            AUDIT TRAIL & LOGS // RECORD OF EVENTS
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Activity Log
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchActivities}>
            REFRESH
          </Button>
          <Button
            variant="danger"
            size="sm"
            isLoading={resetting}
            onClick={handleResetData}
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> RESET DEMO DATA
          </Button>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="border-hairline border-border bg-surface p-12 relative" style={{ borderRadius: '2px' }}>
          <CornerMarkers size={10} strokeWidth={1.5} />
          <EmptyState
            title="No Activity Events Recorded"
            description="System operations, enrolment events, and access dispatches will be recorded in this chronological ledger."
          />
        </div>
      ) : (
        <div className="border-hairline border-border bg-surface relative" style={{ borderRadius: '2px' }}>
          <CornerMarkers size={8} strokeWidth={1} />
          
          <div className="p-4 border-b border-border flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
              CHRONOLOGICAL AUDIT LEDGER // {activities.length} EVENTS
            </span>
            <span className="font-mono text-[10px] text-muted">MUTABLE LOCAL STORAGE</span>
          </div>

          <div className="divide-y divide-border/60">
            {activities.map((item) => (
              <div key={item.id} className="p-4 hover:bg-surface-hover/50 transition-colors flex items-start gap-4">
                <div className="mt-1 p-1.5 border-hairline border-border bg-background" style={{ borderRadius: '2px' }}>
                  {getEventIcon(item.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-medium text-foreground text-sm">
                        {item.title}
                      </span>
                      <code className="font-mono text-[9px] text-muted px-1.5 py-0.5 border-hairline border-border bg-background" style={{ borderRadius: '2px' }}>
                        {item.type}
                      </code>
                    </div>
                    <span className="font-mono text-[10px] text-muted shrink-0">
                      {formatDate(item.timestamp, true)}
                    </span>
                  </div>

                  <p className="font-sans text-xs text-muted leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mt-2 flex items-center gap-3 font-mono text-[9px] text-muted">
                    <span>ACTOR: <strong className="text-foreground">{item.actor || 'System'}</strong></span>
                    {item.studentId && <span>TARGET: {item.studentId}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}
