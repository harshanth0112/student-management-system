import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { LayoutDashboard, Users, Heart, Mail, Activity, Plus } from 'lucide-react';

export function Sidebar({ favouritesCount = 0 }) {
  const navItems = [
    { label: '01. DASHBOARD', path: ROUTES.TEACHER_DASHBOARD, icon: LayoutDashboard },
    { label: '02. STUDENTS', path: ROUTES.TEACHER_STUDENTS, icon: Users },
    { label: '03. FAVOURITES', path: ROUTES.TEACHER_FAVOURITES, icon: Heart, badge: favouritesCount },
    { label: '04. INVITATIONS', path: ROUTES.TEACHER_INVITATIONS, icon: Mail },
    { label: '05. ACTIVITY', path: ROUTES.TEACHER_ACTIVITY, icon: Activity },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-hairline border-border bg-background pt-20 pb-6 px-4 shrink-0 min-h-screen">
      {/* Quick Add CTA */}
      <div className="mb-6 px-2">
        <NavLink
          to={ROUTES.TEACHER_STUDENT_NEW}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-[var(--color-primary-text)] font-mono text-[10px] uppercase tracking-widest hover:opacity-95 transition-opacity"
          style={{ borderRadius: '2px' }}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>ADD STUDENT</span>
        </NavLink>
      </div>

      {/* Nav List */}
      <div className="font-mono text-[9px] uppercase tracking-widest text-muted px-2 mb-2">
        FACULTY TERMINAL // NAVIGATION
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === ROUTES.TEACHER_STUDENTS || item.path === ROUTES.TEACHER_DASHBOARD}
            className={({ isActive }) => `
              flex items-center justify-between px-3 py-2.5 font-mono text-[10px] uppercase tracking-widest transition-colors
              border-l-2
              ${isActive 
                ? 'border-primary bg-surface text-foreground font-bold' 
                : 'border-transparent text-muted hover:text-foreground hover:bg-surface/50'
              }
            `}
          >
            <div className="flex items-center gap-2.5">
              <item.icon className="w-3.5 h-3.5 shrink-0" />
              <span>{item.label}</span>
            </div>

            {item.badge !== undefined && (
              <span className="w-4 h-4 bg-primary text-[var(--color-primary-text)] flex items-center justify-center text-[9px] font-bold">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Telemetry Box */}
      <div className="mt-auto p-3 border-hairline border-border bg-surface text-muted font-mono text-[9px] uppercase tracking-widest space-y-1" style={{ borderRadius: '2px' }}>
        <div>NODE: SECURE // FACULTY</div>
        <div>SYS: PROTOTYPE-V1</div>
      </div>
    </aside>
  );
}
