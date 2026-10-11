import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Container } from '../ui/Container';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { CornerMarkers } from '../ui/CornerMarkers';
import { ScanLoader } from '../ui/ScanLoader';
import { accessRequestSchema } from '../../utils/validators';
import { accessRequestService } from '../../services/accessRequestService';
import { ROLES } from '../../constants/roles';
import { landingContent } from '../../data/landingContent';
import { CheckCircle2, UserCheck, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const DEPARTMENTS = [
  { value: 'Computer Science', label: 'Computer Science' },
  { value: 'Electrical Engineering', label: 'Electrical Engineering' },
  { value: 'Mechanical Engineering', label: 'Mechanical Engineering' },
  { value: 'Mathematics', label: 'Mathematics' },
];

export function RequestAccessForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState(null);
  const { requestAccess } = landingContent;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(accessRequestSchema),
    defaultValues: {
      name: '',
      email: '',
      role: ROLES.STUDENT,
      rollNumber: '',
      department: 'Computer Science',
      classGrade: 'Year 1 - Section A',
      phone: '',
      bio: '',
      message: '',
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await accessRequestService.submitRequest(data);
      setSuccessResult(result);
      toast.success('Complete enrolment request submitted');
      reset();
    } catch (err) {
      toast.error(err.message || 'Failed to submit access request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="request-access" className="py-20 border-b border-hairline border-border">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Headline */}
          <div className="lg:col-span-5 space-y-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
              {requestAccess.sectionNumber} // {requestAccess.sectionTitle}
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-[0.95]">
              {requestAccess.heading}
            </h2>
            <p className="font-sans text-sm text-muted leading-relaxed">
              Fill out your complete academic profile below. Once submitted, faculty administrators can immediately review and <strong>1-click approve</strong> your enrolment into the institutional roster.
            </p>

            <div className="p-4 border-hairline border-border bg-surface font-mono text-[10px] text-muted space-y-2 mt-6" style={{ borderRadius: '2px' }}>
              <div className="flex items-center gap-2 text-primary font-bold uppercase">
                <ShieldCheck className="w-4 h-4" />
                <span>1-CLICK ADMIN APPROVAL WORKFLOW</span>
              </div>
              <p className="leading-relaxed">
                All fields provided here allow the faculty admin to enrol you directly without manual re-typing. Once approved, temporary portal credentials will be generated and issued in the outbox dispatch queue.
              </p>
            </div>
          </div>

          {/* Right Column: Complete Form Box with 4 Corner Markers */}
          <div className="lg:col-span-7 max-w-[680px] w-full ml-auto">
            <div className="border-hairline border-border bg-surface p-8 sm:p-10 relative" style={{ borderRadius: '2px' }}>
              <CornerMarkers size={12} strokeWidth={2} />

              {!successResult ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {isSubmitting && (
                    <div className="mb-4">
                      <ScanLoader variant="primary" />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Full Legal Name"
                      placeholder="Marcus Vance"
                      required
                      {...register('name')}
                      error={errors.name?.message}
                    />

                    <Input
                      label="Gmail Address"
                      placeholder="marcus.vance@gmail.com"
                      required
                      {...register('email')}
                      error={errors.email?.message}
                      helperText="Official @gmail.com required"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Roll Number / Student ID"
                      placeholder="CS-2026-088"
                      required
                      {...register('rollNumber')}
                      error={errors.rollNumber?.message}
                    />

                    <Select
                      label="Department"
                      required
                      options={DEPARTMENTS}
                      {...register('department')}
                      error={errors.department?.message}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Class / Cohort / Section"
                      placeholder="Year 1 - Section A"
                      required
                      {...register('classGrade')}
                      error={errors.classGrade?.message}
                    />

                    <Input
                      label="Phone Number (Optional)"
                      placeholder="+1 (555) 234-5678"
                      {...register('phone')}
                      error={errors.phone?.message}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-muted">
                      Academic Bio / Focus Area
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Distributed algorithms and cloud architecture research."
                      className="w-full bg-surface px-3 py-2 text-[14px] font-sans text-foreground border-hairline border-border placeholder:font-mono placeholder:text-[11px] placeholder:text-muted/60 focus:border-primary focus:outline-none focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2 resize-none"
                      style={{ borderRadius: '2px' }}
                      {...register('bio')}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-muted">
                      Application Note (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Transfer student needing spring semester portal registration."
                      className="w-full bg-surface px-3 py-2 text-[14px] font-sans text-foreground border-hairline border-border placeholder:font-mono placeholder:text-[11px] placeholder:text-muted/60 focus:border-primary focus:outline-none focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2"
                      style={{ borderRadius: '2px' }}
                      {...register('message')}
                    />
                  </div>

                  <div className="pt-3">
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={isSubmitting}
                      className="w-full"
                    >
                      SUBMIT COMPLETE APPLICATION
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6 text-center py-6">
                  <div className="w-12 h-12 mx-auto border-hairline border-border bg-background flex items-center justify-center text-primary" style={{ borderRadius: '2px' }}>
                    <CheckCircle2 className="w-6 h-6 stroke-[1.5]" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-display text-2xl font-bold text-foreground">
                      Application Transmitted
                    </h3>
                    <p className="font-sans text-xs text-muted max-w-sm mx-auto">
                      Your complete student profile has been submitted to the faculty review queue.
                    </p>
                    <div className="font-mono text-xs font-bold text-primary pt-2">
                      TRACKING REF: {successResult.refCode}
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      variant="outline"
                      onClick={() => setSuccessResult(null)}
                      className="w-full"
                    >
                      SUBMIT ANOTHER APPLICATION
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
