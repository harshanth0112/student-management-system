import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { loginSchema } from '../../utils/validators';
import { Input, Button, CornerMarkers, WordReveal } from '../../components/ui';
import { ROUTES } from '../../constants/routes';
import { ROLES } from '../../constants/roles';
import { Eye, EyeOff, ShieldCheck, ArrowLeft, KeyRound } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const user = await login(data.email, data.password);
      
      // If student with first login, route to force-password-change
      if (user.role === ROLES.STUDENT && user.isFirstLogin) {
        navigate(ROUTES.STUDENT_FORCE_PASSWORD);
        return;
      }

      // Respect intended return URL
      const intendedPath = location.state?.from?.pathname;
      if (intendedPath) {
        navigate(intendedPath);
        return;
      }

      // Default role landing
      navigate(user.role === ROLES.TEACHER ? ROUTES.TEACHER_DASHBOARD : ROUTES.STUDENT_DASHBOARD);
    } catch {
      // Error handled by AuthContext toast
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = (email, password) => {
    setValue('email', email);
    setValue('password', password);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-16">
      {/* Top Header Link */}
      <div className="flex items-center justify-between">
        <Link 
          to={ROUTES.HOME} 
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO HOME</span>
        </Link>

        <div className="inline-flex items-center gap-2 px-2.5 py-1 border-hairline border-border bg-surface font-mono text-[10px] uppercase tracking-widest text-muted" style={{ borderRadius: '2px' }}>
          <span className="w-2 h-2 bg-primary animate-pulse" />
          <span>PROTOTYPE // SIMULATED LOGIN</span>
        </div>
      </div>

      {/* Main Two-Column Split */}
      <div className="my-auto py-12 max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Technical Manifesto */}
        <div className="lg:col-span-6 space-y-6">
          <div className="w-10 h-10 bg-primary flex items-center justify-center text-[var(--color-primary-text)] font-mono text-sm font-bold" style={{ borderRadius: '2px' }}>
            FS
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-foreground leading-[0.95]">
            Know your class. <br />
            <span className="text-primary font-bold">Keep your favourites.</span>
          </h1>

          <div className="pt-2">
            <WordReveal
              as="p"
              className="text-sm font-sans text-muted leading-relaxed max-w-md"
              text="Role-based directory terminal. Faculty manage class rosters and private favourites; students access only their personal identity and department announcements."
            />
          </div>
        </div>

        {/* Right Column: Login Box with Corner Markers & Demo Panel */}
        <div className="lg:col-span-6 max-w-md w-full mx-auto space-y-6">
          <div className="border-hairline border-border bg-surface p-8 relative" style={{ borderRadius: '2px' }}>
            <CornerMarkers size={12} strokeWidth={2} />

            <div className="mb-6">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
                Authenticate Session
              </h2>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted mt-1">
                ENTER REGISTERED GMAIL CREDENTIALS
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Gmail Address"
                placeholder="instructor@gmail.com"
                required
                {...register('email')}
                error={errors.email?.message}
              />

              <div className="space-y-1.5">
                <Input
                  label="Password / Passkey"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  required
                  {...register('password')}
                  error={errors.password?.message}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 text-muted hover:text-foreground"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />
                <div className="flex justify-end">
                  <Link
                    to={ROUTES.FORGOT_PASSWORD}
                    className="font-mono text-[10px] uppercase tracking-widest text-muted hover:text-foreground"
                  >
                    RECOVER KEY?
                  </Link>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                  className="w-full"
                >
                  ENTER TERMINAL
                </Button>
              </div>
            </form>
          </div>

          {/* Bordered Demo Credentials Panel in Mono */}
          <div className="border-hairline border-border bg-background p-4 font-mono text-[11px] space-y-2.5" style={{ borderRadius: '2px' }}>
            <div className="flex items-center justify-between text-muted pb-1 border-b border-border">
              <span className="uppercase tracking-widest flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-primary" />
                DEMO CREDENTIALS
              </span>
              <span className="text-[9px]">CLICK TO AUTOFILL</span>
            </div>

            <div className="space-y-1.5 pt-1">
              {/* Teacher */}
              <button
                type="button"
                onClick={() => handleFillDemo('evelyn.reed@gmail.com', 'password123')}
                className="w-full text-left p-1.5 border-hairline border-border hover:border-foreground/30 bg-surface flex items-center justify-between group transition-colors"
                style={{ borderRadius: '2px' }}
              >
                <div>
                  <span className="text-primary font-bold">[TEACHER]</span> evelyn.reed@gmail.com
                </div>
                <span className="text-[10px] text-muted group-hover:text-foreground">password123</span>
              </button>

              {/* Active Student */}
              <button
                type="button"
                onClick={() => handleFillDemo('alex.turner@gmail.com', 'password123')}
                className="w-full text-left p-1.5 border-hairline border-border hover:border-foreground/30 bg-surface flex items-center justify-between group transition-colors"
                style={{ borderRadius: '2px' }}
              >
                <div>
                  <span className="text-primary font-bold">[STUDENT]</span> alex.turner@gmail.com
                </div>
                <span className="text-[10px] text-muted group-hover:text-foreground">password123</span>
              </button>

              {/* Invited Student with Temporary Passkey */}
              <button
                type="button"
                onClick={() => handleFillDemo('maya.lin@gmail.com', 'TMP-MY92-4410')}
                className="w-full text-left p-1.5 border-hairline border-border hover:border-foreground/30 bg-surface flex items-center justify-between group transition-colors"
                style={{ borderRadius: '2px' }}
              >
                <div>
                  <span className="text-[var(--color-status-invited)] font-bold">[INVITED]</span> maya.lin@gmail.com
                </div>
                <span className="text-[10px] text-muted group-hover:text-foreground">TMP-MY92-4410</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="font-mono text-[9px] uppercase tracking-widest text-muted text-center pt-8 border-t border-border">
        PROTOTYPE // PASSWORDS AND SESSIONS ARE SIMULATED IN LOCALSTORAGE
      </div>
    </div>
  );
}
