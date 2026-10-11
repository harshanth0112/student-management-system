import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { X, LayoutDashboard, Users, Heart, Mail, Activity, Plus } from 'lucide-react';

export function MobileDrawer({ isOpen, onClose, favouritesCount = 0 }) {
  const drawerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navItems = [
    { label: '01. DASHBOARD', path: ROUTES.TEACHER_DASHBOARD, icon: LayoutDashboard },
    { label: '02. STUDENTS', path: ROUTES.TEACHER_STUDENTS, icon: Users },
    { label: '03. FAVOURITES', path: ROUTES.TEACHER_FAVOURITES, icon: Heart, badge: favouritesCount },
    { label: '04. INVITATIONS', path: ROUTES.TEACHER_INVITATIONS, icon: Mail },
    { label: '05. ACTIVITY', path: ROUTES.TEACHER_ACTIVITY, icon: Activity },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 lg:hidden flex"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation drawer"
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true" 
      />

      {/* Drawer content */}
      <div 
        ref={drawerRef}
        className="relative w-72 max-w-[80vw] bg-background border-r border-hairline border-border h-full flex flex-col p-6 z-10 shadow-none animate-in slide-in-from-left duration-200"
      >
        <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
          <div className="font-display font-bold text-sm tracking-tight text-foreground">
            FACULTY PORTAL
          </div>
          <button
            onClick={onClose}
            className="p-1 text-muted hover:text-foreground"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <NavLink
            to={ROUTES.TEACHER_STUDENT_NEW}
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-[var(--color-primary-text)] font-mono text-[10px] uppercase tracking-widest"
            style={{ borderRadius: '2px' }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ADD STUDENT</span>
          </NavLink>
        </div>

        <nav className="space-y-1.5 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              end={item.path === ROUTES.TEACHER_STUDENTS || item.path === ROUTES.TEACHER_DASHBOARD}
              className={({ isActive }) => `
                flex items-center justify-between px-3 py-2.5 font-mono text-[11px] uppercase tracking-widest border-l-2
                ${isActive 
                  ? 'border-primary bg-surface text-foreground font-bold' 
                  : 'border-transparent text-muted hover:text-foreground hover:bg-surface/50'
                }
              `}
            >
              <div className="flex items-center gap-2.5">
                <item.icon className="w-4 h-4" />
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
      </div>
    </div>
  );
}
