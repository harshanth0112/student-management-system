import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { forgotPasswordSchema } from '../../utils/validators';
import { authService } from '../../services/authService';
import { Input, Button, CornerMarkers } from '../../components/ui';
import { ROUTES } from '../../constants/routes';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await authService.requestPasswordReset(data.email);
      setResetEmail(data.email);
      setIsSubmitted(true);
      toast.success('Reset dispatch simulated.');
    } catch (err) {
      toast.error(err.message || 'Recovery failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-16">
      <div>
        <Link
          to={ROUTES.LOGIN}
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO LOGIN</span>
        </Link>
      </div>

      <div className="my-auto max-w-md w-full mx-auto">
        <div className="border-hairline border-border bg-surface p-8 relative" style={{ borderRadius: '2px' }}>
          <CornerMarkers size={12} strokeWidth={2} />

          {!isSubmitted ? (
            <>
              <div className="mb-6">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">
                  SECURITY KEY RECOVERY // SIMULATED
                </div>
                <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
                  Reset Password
                </h1>
                <p className="font-sans text-xs text-muted leading-relaxed mt-2">
                  Enter your registered Gmail address. In this prototype, recovery instructions are simulated client-side.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Input
                  label="Registered Gmail"
                  placeholder="student@gmail.com"
                  required
                  {...register('email')}
                  error={errors.email?.message}
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isLoading}
                    className="w-full"
                  >
                    DISPATCH RECOVERY LINK
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="space-y-6 text-center py-4">
              <div className="w-12 h-12 mx-auto border-hairline border-border bg-background flex items-center justify-center text-primary" style={{ borderRadius: '2px' }}>
                <CheckCircle2 className="w-6 h-6 stroke-[1.5]" />
              </div>

              <div className="space-y-2">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Recovery Simulated
                </h2>
                <p className="font-mono text-xs text-muted leading-relaxed">
                  Reset link sent to <span className="text-foreground">{resetEmail}</span>. Since authentication is simulated, you can log in directly using the demo credentials.
                </p>
              </div>

              <div className="pt-2">
                <Link to={ROUTES.LOGIN} className="w-full block">
                  <Button variant="outline" className="w-full">
                    RETURN TO LOGIN
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="font-mono text-[9px] uppercase tracking-widest text-muted text-center pt-8 border-t border-border">
        PROTOTYPE // SIMULATED SYSTEM
      </div>
    </div>
  );
}
