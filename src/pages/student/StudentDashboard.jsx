import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Section } from '../../components/ui/Section';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { CornerMarkers } from '../../components/ui/CornerMarkers';
import { Skeleton } from '../../components/ui/Skeleton';
import { announcementService } from '../../services/announcementService';
import { storageService } from '../../services/storageService';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import { ROUTES } from '../../constants/routes';
import { formatDate } from '../../utils/formatters';
import { BookOpen, Bell, ArrowRight, UserCheck, ShieldCheck, Mail, Calendar } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await announcementService.getAnnouncements();
        setAnnouncements(data);
      } catch (err) {
        console.error('Failed to load announcements', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();

    // Centralized store listener: sync announcements immediately if updated
    const unsubscribe = storageService.subscribe((key) => {
      if (key === STORAGE_KEYS.ANNOUNCEMENTS || key === '*') {
        loadData();
      }
    });

    return unsubscribe;
  }, []);

  if (!user) return null;

  return (
    <Section className="py-8">
      {/* Welcome Banner */}
      <div className="mb-8 border-hairline border-border bg-surface p-6 sm:p-8 relative" style={{ borderRadius: '2px' }}>
        <CornerMarkers size={10} strokeWidth={1.5} />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <Avatar name={user.name} size="xl" src={user.avatar} />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="active">STUDENT PORTAL</Badge>
                <span className="font-mono text-[10px] text-muted">ID: {user.rollNumber || user.id}</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Welcome, {user.name}
              </h1>
              <p className="font-sans text-sm text-muted mt-1">
                {user.department || 'General Studies'} • {user.classGrade || 'Cohort 2026'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to={ROUTES.STUDENT_PROFILE}>
              <Button variant="outline" size="sm">
                VIEW PROFILE
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Quick Telemetry & Status */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border-hairline border-border bg-surface p-6 relative" style={{ borderRadius: '2px' }}>
            <CornerMarkers size={8} strokeWidth={1} />
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-border">
              <UserCheck className="w-4 h-4 text-primary" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary">ENROLMENT STATUS</span>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-border/50">
                <span className="text-muted">ACCOUNT STATUS</span>
                <Badge variant="active">{user.status?.toUpperCase() || 'ACTIVE'}</Badge>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border/50">
                <span className="text-muted">ROLL NUMBER</span>
                <span className="text-foreground">{user.rollNumber || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border/50">
                <span className="text-muted">REGISTERED EMAIL</span>
                <span className="text-foreground truncate max-w-[180px]">{user.email}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border/50">
                <span className="text-muted">DEPARTMENT</span>
                <span className="text-foreground">{user.department || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted">SECURITY LEVEL</span>
                <span className="text-primary font-mono">STANDALONE STUDENT</span>
              </div>
            </div>
          </div>

          <div className="border-hairline border-border bg-surface p-6 relative" style={{ borderRadius: '2px' }}>
            <CornerMarkers size={8} strokeWidth={1} />
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-border">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary">PORTAL ADVISORY</span>
            </div>
            <p className="font-sans text-xs text-muted leading-relaxed">
              Your profile is managed under the institution directory. For academic record corrections or department transfer requests, contact your assigned faculty coordinator.
            </p>
          </div>
        </div>

        {/* Right Column: Institutional Announcements Feed */}
        <div className="lg:col-span-7">
          <div className="border-hairline border-border bg-surface p-6 sm:p-8 relative" style={{ borderRadius: '2px' }}>
            <CornerMarkers size={8} strokeWidth={1} />
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-border">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-primary">ANNOUNCEMENTS & NOTICES</span>
              </div>
              <span className="font-mono text-[10px] text-muted">CHRONOLOGICAL FEED</span>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-20" style={{ borderRadius: '2px' }} />
                ))}
              </div>
            ) : announcements.length === 0 ? (
              <div className="py-8 text-center font-mono text-xs text-muted uppercase tracking-widest">
                NO ANNOUNCEMENTS POSTED
              </div>
            ) : (
              <div className="space-y-4">
                {announcements.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 border-hairline border-border bg-background/50 hover:border-foreground/40 transition-colors"
                    style={{ borderRadius: '2px' }}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-display font-semibold text-foreground text-sm">
                        {item.title}
                      </span>
                      <span className="font-mono text-[10px] text-muted shrink-0">
                        {formatDate(item.date)}
                      </span>
                    </div>
                    <p className="font-sans text-xs text-muted leading-relaxed mb-3">
                      {item.content}
                    </p>
                    <div className="flex items-center gap-2 font-mono text-[9px] text-primary uppercase tracking-widest">
                      <span>TAG: {item.category || 'ACADEMIC'}</span>
                      {item.priority === 'high' && <Badge variant="danger">HIGH PRIORITY</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
