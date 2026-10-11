import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { forcePasswordChangeSchema } from '../../utils/validators';
import { Input, Button, CornerMarkers } from '../../components/ui';
import { ROUTES } from '../../constants/routes';
import { KeyRound, ShieldAlert } from 'lucide-react';

export default function ForceChangePasswordPage() {
  const { user, forceChangePassword } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forcePasswordChangeSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await forceChangePassword(data.newPassword);
      navigate(ROUTES.STUDENT_DASHBOARD);
    } catch {
      // Error handled by AuthContext toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full border-hairline border-border bg-surface p-8 relative space-y-6" style={{ borderRadius: '2px' }}>
        <CornerMarkers size={12} strokeWidth={2} />

        <div className="flex items-center gap-2 text-primary font-mono text-[10px] uppercase tracking-widest">
          <KeyRound className="w-4 h-4" />
          <span>SECURITY REQUIREMENT // FIRST LOGIN</span>
        </div>

        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Establish Personal Password
          </h1>
          <p className="font-sans text-xs text-muted leading-relaxed">
            Welcome, <span className="text-foreground font-medium">{user?.name}</span>. You authenticated using a temporary passkey. You must establish a secure permanent password before entering your student dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="New Password"
            type="password"
            placeholder="At least 8 characters"
            required
            {...register('newPassword')}
            error={errors.newPassword?.message}
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Repeat new password"
            required
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full"
            >
              UPDATE PASSWORD & ENTER
            </Button>
          </div>
        </form>

        <div className="font-mono text-[9px] uppercase tracking-widest text-muted text-center pt-3 border-t border-border">
          ACCOUNT STATUS WILL TRANSITION TO: [ACTIVE]
        </div>
      </div>
    </div>
  );
}
