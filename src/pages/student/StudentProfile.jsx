import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../hooks/useAuth';
import { Section } from '../../components/ui/Section';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { CornerMarkers } from '../../components/ui/CornerMarkers';
import { studentSelfEditSchema } from '../../utils/validators';
import { ROUTES } from '../../constants/routes';
import { formatDate } from '../../utils/formatters';
import { Copy, Check, ArrowLeft, Mail, Phone, BookOpen, Shield, KeyRound, Edit2, UserCheck } from 'lucide-react';

export default function StudentProfile() {
  const { user, updateStudentProfile } = useAuth();
  const [copiedField, setCopiedField] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(studentSelfEditSchema),
    defaultValues: {
      phone: user?.phone === '—' ? '' : user?.phone || '',
      bio: user?.bio || '',
    },
  });

  if (!user) return null;

  const handleCopy = (field, text) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleOpenEdit = () => {
    reset({
      phone: user?.phone === '—' ? '' : user?.phone || '',
      bio: user?.bio || '',
    });
    setIsEditModalOpen(true);
  };

  const onSubmitEdit = async (data) => {
    setIsSubmitting(true);
    try {
      await updateStudentProfile(data);
      setIsEditModalOpen(false);
    } catch {
      // toast is already fired in context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section className="py-8 max-w-4xl">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to={ROUTES.STUDENT_DASHBOARD}
          className="inline-flex items-center gap-2 text-muted hover:text-foreground font-mono text-[11px] uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> BACK TO DASHBOARD
        </Link>
      </div>

      {/* Main Profile Card */}
      <div className="border-hairline border-border bg-surface p-6 sm:p-8 relative mb-8" style={{ borderRadius: '2px' }}>
        <CornerMarkers size={10} strokeWidth={1.5} />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-border mb-6">
          <div className="flex items-center gap-5">
            <Avatar name={user.name} size="xl" src={user.avatar} />
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Badge variant="active">VERIFIED STUDENT</Badge>
                <span className="font-mono text-xs text-muted">ROLL // {user.rollNumber}</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {user.name}
              </h1>
              <p className="font-sans text-sm text-muted">
                {user.department} • Class {user.classGrade || 'Section A'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Button variant="primary" size="sm" onClick={handleOpenEdit} className="w-full sm:w-auto">
              <Edit2 className="w-3.5 h-3.5 mr-2" /> EDIT PROFILE
            </Button>
            <Link to={ROUTES.FORCE_CHANGE_PASSWORD}>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <KeyRound className="w-3.5 h-3.5 mr-2" /> UPDATE PASSWORD
              </Button>
            </Link>
          </div>
        </div>

        {/* Detailed Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Academic Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-primary">ACADEMIC RECORD</span>
              </div>
              <span className="font-mono text-[9px] text-muted">READ ONLY</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 border-hairline border-border/60 bg-background/50 flex justify-between items-center" style={{ borderRadius: '2px' }}>
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-muted mb-0.5">DEPARTMENT</div>
                  <div className="text-foreground font-sans font-medium">{user.department}</div>
                </div>
              </div>

              <div className="p-3 border-hairline border-border/60 bg-background/50 flex justify-between items-center" style={{ borderRadius: '2px' }}>
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-muted mb-0.5">CLASS / GRADE</div>
                  <div className="text-foreground font-sans font-medium">{user.classGrade || 'Not Specified'}</div>
                </div>
              </div>

              <div className="p-3 border-hairline border-border/60 bg-background/50 flex justify-between items-center" style={{ borderRadius: '2px' }}>
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-muted mb-0.5">ROLL NUMBER</div>
                  <div className="text-foreground font-mono">{user.rollNumber}</div>
                </div>
                <button
                  onClick={() => handleCopy('roll', user.rollNumber)}
                  className="p-1.5 text-muted hover:text-foreground transition-colors"
                  title="Copy roll number"
                >
                  {copiedField === 'roll' ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Contact & Security Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-primary">COMMUNICATION & CONTACT</span>
              </div>
              <span className="font-mono text-[9px] text-primary">EDITABLE</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 border-hairline border-border/60 bg-background/50 flex justify-between items-center" style={{ borderRadius: '2px' }}>
                <div className="min-w-0 pr-2">
                  <div className="text-[9px] uppercase tracking-widest text-muted mb-0.5">REGISTERED EMAIL</div>
                  <div className="text-foreground font-mono truncate">{user.email}</div>
                </div>
                <button
                  onClick={() => handleCopy('email', user.email)}
                  className="p-1.5 text-muted hover:text-foreground transition-colors shrink-0"
                  title="Copy email"
                >
                  {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="p-3 border-hairline border-border/60 bg-background/50 flex justify-between items-center" style={{ borderRadius: '2px' }}>
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-muted mb-0.5">PHONE NUMBER</div>
                  <div className="text-foreground font-mono">{user.phone || '—'}</div>
                </div>
                <button
                  onClick={handleOpenEdit}
                  className="font-mono text-[10px] text-primary hover:underline"
                >
                  EDIT
                </button>
              </div>

              <div className="p-3 border-hairline border-border/60 bg-background/50 flex justify-between items-center" style={{ borderRadius: '2px' }}>
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-muted mb-0.5">REGISTERED SINCE</div>
                  <div className="text-foreground font-mono">{user.createdAt ? formatDate(user.createdAt) : '2026-01-15'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted">STUDENT BIO / STATEMENT</div>
            <button
              onClick={handleOpenEdit}
              className="font-mono text-[10px] text-primary hover:underline flex items-center gap-1"
            >
              <Edit2 className="w-3 h-3" /> EDIT BIO
            </button>
          </div>
          <p className="font-sans text-sm text-foreground/80 leading-relaxed bg-background/40 p-4 border-hairline border-border/40" style={{ borderRadius: '2px' }}>
            {user.bio || 'No bio provided. Click "Edit Profile" to add your academic focus and research statement.'}
          </p>
        </div>
      </div>

      {/* Student Self-Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Personal Profile"
        subtitle="STUDENT SELF-SERVICE // UPDATE CONTACT & BIO"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit(onSubmitEdit)} className="space-y-4">
          <div className="p-3 border-hairline border-border bg-background/60 font-mono text-[10px] text-muted space-y-1" style={{ borderRadius: '2px' }}>
            <div><strong>NAME:</strong> {user.name}</div>
            <div><strong>ROLL NUMBER:</strong> {user.rollNumber} (Contact faculty coordinator to change academic details)</div>
          </div>

          <Input
            label="Phone Number"
            placeholder="+1 (555) 019-2831"
            {...register('phone')}
            error={errors.phone?.message}
            helperText="Direct contact phone for instructor notifications"
          />

          <div className="flex flex-col gap-1.5 w-full">
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted">
              Academic Bio & Statement
            </label>
            <textarea
              rows={4}
              placeholder="Tell your faculty advisors about your academic interests, project focus, or coursework goals..."
              className="w-full bg-surface px-3 py-2 text-[14px] font-sans text-foreground border-hairline border-border placeholder:font-mono placeholder:text-[11px] placeholder:text-muted/60 focus:border-primary focus:outline-none focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2 resize-none"
              style={{ borderRadius: '2px' }}
              {...register('bio')}
            />
            {errors.bio && (
              <span className="font-mono text-[10px] text-[var(--color-danger)]">
                {errors.bio.message}
              </span>
            )}
          </div>

          <div className="pt-3 border-t border-border flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isSubmitting}
            >
              CANCEL
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
            >
              SAVE CHANGES
            </Button>
          </div>
        </form>
      </Modal>
    </Section>
  );
}
