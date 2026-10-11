import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { ROUTES } from '../../constants/routes';
import { ROLES } from '../../constants/roles';
import { Sun, Moon, Menu, X, ArrowUpRight } from 'lucide-react';

export function PublicNav({ activeSection = '' }) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { scrollY } = useScrollProgress();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const isScrolled = scrollY > 32;

  const navLinks = [
    { label: '01. HOW IT WORKS', href: '#how-it-works', id: 'how-it-works' },
    { label: '02. ROLES', href: '#roles', id: 'roles' },
    { label: '03. TOPOLOGY', href: '#topology', id: 'topology' },
    { label: '04. ACCESS', href: '#request-access', id: 'request-access' },
  ];

  const scrollToAnchor = (href) => {
    setMobileDrawerOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
          isScrolled
            ? 'bg-background/95 backdrop-blur-sm border-b border-hairline border-border h-14'
            : 'bg-transparent border-b border-transparent h-16 pt-2'
        }`}
      >
        <Container className="h-full flex items-center justify-between">
          {/* Logo Box */}
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 bg-primary flex items-center justify-center text-[var(--color-primary-text)] font-mono text-xs font-bold select-none"
              style={{ borderRadius: '2px' }}
            >
              FS
            </div>
            <Link to={ROUTES.HOME} className="flex items-center gap-2 group">
              <span className="font-display font-bold text-sm tracking-tight text-foreground group-hover:text-primary transition-colors">
                FAVOURITE STUDENT LIST
              </span>
            </Link>
          </div>

          {/* Desktop Nav Anchors */}
          <nav className="hidden md:flex items-center gap-7 font-mono text-[10px] uppercase tracking-widest text-muted">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => scrollToAnchor(link.href)}
                  className={`transition-colors flex items-center gap-1 ${
                    isActive 
                      ? 'text-foreground font-bold border-b border-primary' 
                      : 'hover:text-foreground'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right CTAs & Theme Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-1.5 border-hairline border-border hover:bg-surface text-muted hover:text-foreground transition-colors"
              style={{ borderRadius: '2px' }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {user ? (
              <Link to={user.role === ROLES.TEACHER ? ROUTES.TEACHER_DASHBOARD : ROUTES.STUDENT_DASHBOARD}>
                <Button variant="primary" size="sm">
                  OPEN TERMINAL
                </Button>
              </Link>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to={ROUTES.LOGIN}>
                  <Button variant="outline" size="sm">
                    LOG IN
                  </Button>
                </Link>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => scrollToAnchor('#request-access')}
                >
                  REQUEST ACCESS
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden p-1.5 border-hairline border-border hover:bg-surface text-muted hover:text-foreground"
              aria-label="Open navigation menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div 
          className="fixed inset-0 z-50 md:hidden flex"
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
            aria-hidden="true" 
          />
          <div className="relative w-72 max-w-[80vw] bg-background border-r border-hairline border-border h-full flex flex-col p-6 z-10 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
              <span className="font-display font-bold text-sm tracking-tight text-foreground">
                DIRECTORY INDEX
              </span>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 text-muted hover:text-foreground"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-3 font-mono text-[11px] uppercase tracking-widest text-muted flex-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToAnchor(link.href)}
                  className="block w-full text-left py-2 hover:text-foreground border-b border-border/50"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="pt-4 space-y-2 border-t border-border">
              <Link to={ROUTES.LOGIN} onClick={() => setMobileDrawerOpen(false)} className="w-full block">
                <Button variant="outline" size="sm" className="w-full">
                  LOG IN
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
