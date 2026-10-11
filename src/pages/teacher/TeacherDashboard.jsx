import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStudents } from '../../hooks/useStudents';
import { useFavourites } from '../../hooks/useFavourites';
import { Section } from '../../components/ui/Section';
import { StatCard } from '../../components/ui/StatCard';
import { CornerMarkers } from '../../components/ui/CornerMarkers';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { ROUTES } from '../../constants/routes';
import { STUDENT_STATUS } from '../../constants/roles';
import { Users, Heart, MailCheck, ShieldAlert, ArrowRight, Plus, UserPlus } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function TeacherDashboard() {
  const { students, isLoading } = useStudents();
  const { favouritesCount } = useFavourites();

  const metrics = useMemo(() => {
    const total = students.length;
    const active = students.filter((s) => s.status === STUDENT_STATUS.ACTIVE).length;
    const invited = students.filter((s) => s.status === STUDENT_STATUS.INVITED).length;
    const disabled = students.filter((s) => s.status === STUDENT_STATUS.DISABLED).length;

    // Dept distribution
    const deptMap = {};
    students.forEach((s) => {
      deptMap[s.department] = (deptMap[s.department] || 0) + 1;
    });

    const deptData = Object.entries(deptMap).map(([name, count]) => ({
      name,
      count,
    }));

    // Status distribution
    const statusData = [
      { name: 'Active', value: active, color: 'var(--color-primary)' },
      { name: 'Invited', value: invited, color: 'var(--color-accent-gold)' },
      { name: 'Disabled', value: disabled, color: 'var(--color-status-disabled)' },
    ].filter((item) => item.value > 0);

    return { total, active, invited, disabled, deptData, statusData };
  }, [students]);

  if (isLoading) {
    return (
      <Section className="py-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28" style={{ borderRadius: '2px' }} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-72" style={{ borderRadius: '2px' }} />
          <Skeleton className="h-72" style={{ borderRadius: '2px' }} />
        </div>
      </Section>
    );
  }

  const recentStudents = students.slice(0, 5);

  return (
    <Section className="py-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
            TELEMETRY & ROSTER INTELLIGENCE
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Faculty Overview
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link to={ROUTES.TEACHER_STUDENT_NEW}>
            <Button variant="primary" size="sm">
              <UserPlus className="w-3.5 h-3.5 mr-2" /> ENROL STUDENT
            </Button>
          </Link>
          <Link to={ROUTES.TEACHER_STUDENTS}>
            <Button variant="outline" size="sm">
              VIEW ROSTER
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="TOTAL ENROLLED"
          value={metrics.total}
          subtext="Institution Cohort 2026"
          icon={<Users className="w-4 h-4" />}
        />
        <StatCard
          label="ACTIVE ACCESS"
          value={metrics.active}
          subtext={`${Math.round((metrics.active / (metrics.total || 1)) * 100)}% portal login rate`}
          icon={<MailCheck className="w-4 h-4 text-primary" />}
        />
        <StatCard
          label="BOOKMARKED"
          value={favouritesCount}
          subtext="Private instructor shortlist"
          icon={<Heart className="w-4 h-4 text-[var(--color-accent-coral)]" />}
        />
        <StatCard
          label="PENDING ONBOARD"
          value={metrics.invited}
          subtext="Invited temporary passwords"
          icon={<ShieldAlert className="w-4 h-4 text-[var(--color-accent-gold)]" />}
        />
      </div>

      {/* Recharts Analytics Charts (Forest / Mint / Gold / Coral flat fills) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Department Distribution Bar Chart */}
        <div className="lg:col-span-7 border-hairline border-border bg-surface p-6 relative" style={{ borderRadius: '2px' }}>
          <CornerMarkers size={8} strokeWidth={1} />
          <div className="flex items-center justify-between pb-3 mb-6 border-b border-border">
            <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
              DEPARTMENT DISTRIBUTION // ENROLMENTS
            </span>
            <span className="font-mono text-[10px] text-muted">FLAT BARFILL</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.deptData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis
                  dataKey="name"
                  stroke="var(--color-muted)"
                  fontSize={10}
                  tickLine={false}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis
                  stroke="var(--color-muted)"
                  fontSize={10}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                    borderRadius: '2px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="var(--color-primary)"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Pie Chart */}
        <div className="lg:col-span-5 border-hairline border-border bg-surface p-6 relative" style={{ borderRadius: '2px' }}>
          <CornerMarkers size={8} strokeWidth={1} />
          <div className="flex items-center justify-between pb-3 mb-6 border-b border-border">
            <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
              ACCOUNT STATUS RATIO
            </span>
            <span className="font-mono text-[10px] text-muted">PORTAL ACCESS</span>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {metrics.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                    borderRadius: '2px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-2 font-mono text-[10px]">
            {metrics.statusData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-none" style={{ backgroundColor: item.color }} />
                <span className="text-muted">{item.name.toUpperCase()}:</span>
                <span className="text-foreground font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Roster Snippet */}
      <div className="border-hairline border-border bg-surface p-6 relative" style={{ borderRadius: '2px' }}>
        <CornerMarkers size={8} strokeWidth={1} />
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
          <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
            RECENT ENROLMENTS // SAMPLE
          </span>
          <Link
            to={ROUTES.TEACHER_STUDENTS}
            className="font-mono text-[10px] uppercase tracking-wider text-muted hover:text-foreground inline-flex items-center gap-1 transition-colors"
          >
            ROSTER VIEW <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="divide-y divide-border/60">
          {recentStudents.map((st) => (
            <div key={st.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar name={st.name} size="sm" src={st.avatar} />
                <div>
                  <Link
                    to={`${ROUTES.TEACHER_STUDENTS}/${st.id}`}
                    className="font-display font-medium text-foreground hover:text-primary transition-colors text-sm"
                  >
                    {st.name}
                  </Link>
                  <div className="font-mono text-[10px] text-muted">{st.rollNumber} • {st.department}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={st.status === STUDENT_STATUS.ACTIVE ? 'active' : st.status === STUDENT_STATUS.INVITED ? 'invited' : 'disabled'}>
                  {st.status.toUpperCase()}
                </Badge>
                <Link
                  to={`${ROUTES.TEACHER_STUDENTS}/${st.id}`}
                  className="font-mono text-[10px] text-muted hover:text-foreground px-2 py-1 border-hairline border-border hover:border-foreground transition-colors"
                  style={{ borderRadius: '2px' }}
                >
                  VIEW
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
