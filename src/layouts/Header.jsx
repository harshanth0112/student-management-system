import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { Sun, Moon, LogOut, User, Menu, X } from 'lucide-react';
import { ROUTES } from '../constants/routes';
import { ROLES } from '../constants/roles';

export function Header({ onMenuClick, favouritesCount = 0 }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const isTeacher = user?.role === ROLES.TEACHER;

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-hairline border-border h-14">
      <Container className="h-full flex items-center justify-between">
        {/* Brand Left */}
        <div className="flex items-center gap-3">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-1.5 border-hairline border-border hover:bg-surface text-muted hover:text-foreground"
              aria-label="Toggle navigation drawer"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}

          <Link to={ROUTES.HOME} className="flex items-center gap-2.5 group">
            <div 
              className="w-7 h-7 bg-primary flex items-center justify-center text-[var(--color-primary-text)] font-mono text-[11px] font-bold select-none"
              style={{ borderRadius: '2px' }}
            >
              FS
            </div>
            <span className="font-display font-bold text-sm tracking-tight text-foreground group-hover:text-primary transition-colors">
              FAVOURITE STUDENT LIST
            </span>
          </Link>
        </div>

        {/* Actions Right */}
        <div className="flex items-center gap-3">
          {/* Teacher Favourites Badge */}
          {isTeacher && (
            <Link
              to={ROUTES.TEACHER_FAVOURITES}
              className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1 border-hairline border-border bg-surface font-mono text-[10px] uppercase tracking-widest text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
              style={{ borderRadius: '2px' }}
            >
              <span>FAVOURITES</span>
              <span className="w-4 h-4 bg-primary text-[var(--color-primary-text)] flex items-center justify-center text-[9px] font-bold">
                {favouritesCount}
              </span>
            </Link>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 border-hairline border-border hover:bg-surface text-muted hover:text-foreground transition-colors"
            style={{ borderRadius: '2px' }}
            aria-label="Toggle light and dark mode"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Profile Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-2.5 py-1 border-hairline border-border hover:border-foreground/40 bg-surface font-mono text-[10px] uppercase tracking-widest text-foreground transition-colors"
                style={{ borderRadius: '2px' }}
                aria-expanded={profileOpen}
              >
                <User className="w-3.5 h-3.5 text-primary" />
                <span className="hidden sm:inline max-w-[120px] truncate">{user.name}</span>
              </button>

              {profileOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setProfileOpen(false)} 
                    aria-hidden="true" 
                  />
                  <div 
                    className="absolute right-0 mt-1 w-52 bg-surface border-hairline border-border p-3 z-40 space-y-2.5 shadow-none"
                    style={{ borderRadius: '2px' }}
                  >
                    <div className="border-b border-border pb-2">
                      <div className="font-display font-bold text-xs text-foreground truncate">{user.name}</div>
                      <div className="font-mono text-[9px] text-muted uppercase tracking-widest">{user.role} // {user.department || 'GENERAL'}</div>
                    </div>

                    {user.role === ROLES.STUDENT && (
                      <Link
                        to={ROUTES.STUDENT_PROFILE}
                        onClick={() => setProfileOpen(false)}
                        className="block font-mono text-[10px] uppercase tracking-widest text-muted hover:text-foreground py-1"
                      >
                        MY PROFILE
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 pt-1.5 border-t border-border font-mono text-[10px] uppercase tracking-widest text-[var(--color-danger)] hover:opacity-80 text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      TERMINATE SESSION
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link to={ROUTES.LOGIN}>
              <Button variant="primary" size="sm">
                LOG IN
              </Button>
            </Link>
          )}
        </div>
      </Container>
    </header>
  );
}
