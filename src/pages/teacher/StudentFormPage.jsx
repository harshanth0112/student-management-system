import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useStudents } from '../../hooks/useStudents';
import { Container } from '../../components/ui/Container';
import { Section } from '../../components/ui/Section';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { CornerMarkers } from '../../components/ui/CornerMarkers';
import { Skeleton } from '../../components/ui/Skeleton';
import { ScanLoader } from '../../components/ui/ScanLoader';
import { studentSchema } from '../../utils/validators';
import { ROUTES } from '../../constants/routes';
import { ArrowLeft, Copy, Check, Mail, KeyRound } from 'lucide-react';

const DEPARTMENTS = [
  { value: 'Computer Science', label: 'Computer Science' },
  { value: 'Electrical Engineering', label: 'Electrical Engineering' },
  { value: 'Mechanical Engineering', label: 'Mechanical Engineering' },
  { value: 'Mathematics', label: 'Mathematics' },
];

export default function StudentFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { students, addStudent, updateStudent } = useStudents();
  const isEditing = !!id;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingStudent, setIsLoadingStudent] = useState(isEditing);
  const [credentialModal, setCredentialModal] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: '',
      email: '',
      rollNumber: '',
      classGrade: '',
      department: '',
      phone: '',
    },
  });

  // Populate form if editing
  useEffect(() => {
    if (isEditing && students.length > 0) {
      const student = students.find((s) => s.id === id);
      if (student) {
        reset({
          name: student.name,
          email: student.email,
          rollNumber: student.rollNumber,
          classGrade: student.classGrade,
          department: student.department,
          phone: student.phone || '',
        });
      }
      setIsLoadingStudent(false);
    }
  }, [isEditing, id, students, reset]);

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1800);
    });
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateStudent(id, data);
        navigate(`/teacher/students/${id}`);
      } else {
        const result = await addStudent(data);
        // Show credential modal with temp password
        setCredentialModal({
          student: result.student,
          temporaryPassword: result.temporaryPassword,
          invitation: result.invitation,
        });
      }
    } catch (err) {
      // Toast errors are handled by the context
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditing && isLoadingStudent) {
    return (
      <Section>
        <Container>
          <div className="py-8 space-y-4 max-w-2xl">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-64" />
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container>
        <div className="py-6 sm:py-8 max-w-2xl space-y-6">
          {/* Back Navigation */}
          <Link
            to={ROUTES.TEACHER_STUDENTS}
            className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>BACK TO ROSTER</span>
          </Link>

          {/* Page Header */}
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">
              TEACHER // {isEditing ? 'EDIT RECORD' : 'NEW ENROLLMENT'}
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {isEditing ? 'Edit Student' : 'Enroll New Student'}
            </h1>
          </div>

          {/* Form with Corner Markers */}
          <div className="relative border-hairline border-border bg-surface p-6 sm:p-8" style={{ borderRadius: '2px' }}>
            <CornerMarkers size={10} strokeWidth={1.5} />

            {isSubmitting && (
              <div className="mb-6">
                <ScanLoader variant="primary" />
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted text-center mt-2">
                  {isEditing ? 'UPDATING RECORD...' : 'GENERATING CREDENTIALS & DISPATCHING INVITATION...'}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Full Name"
                  placeholder="Marcus Vance"
                  required
                  {...register('name')}
                  error={errors.name?.message}
                />
                <Input
                  label="Gmail Address"
                  placeholder="student@gmail.com"
                  required
                  disabled={isEditing}
                  {...register('email')}
                  error={errors.email?.message}
                  helperText={!isEditing ? 'Must be @gmail.com' : 'Cannot change email after enrollment'}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Roll Number"
                  placeholder="CS-2026-001"
                  required
                  {...register('rollNumber')}
                  error={errors.rollNumber?.message}
                />
                <Input
                  label="Class / Grade"
                  placeholder="Year 4 - Section A"
                  required
                  {...register('classGrade')}
                  error={errors.classGrade?.message}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Select
                  label="Department"
                  required
                  options={DEPARTMENTS}
                  {...register('department')}
                  error={errors.department?.message}
                />
                <Input
                  label="Phone (Optional)"
                  placeholder="+1 (555) 012-3456"
                  {...register('phone')}
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(ROUTES.TEACHER_STUDENTS)}
                  disabled={isSubmitting}
                >
                  CANCEL
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                  disabled={isEditing && !isDirty}
                >
                  {isEditing ? 'SAVE CHANGES' : 'ENROLL & DISPATCH INVITE'}
                </Button>
              </div>
            </form>
          </div>

          {!isEditing && (
            <div className="p-4 border-hairline border-border bg-surface font-mono text-[10px] text-muted space-y-1" style={{ borderRadius: '2px' }}>
              <div className="text-foreground font-bold uppercase">ENROLLMENT PROCESS:</div>
              <div>1. A unique temporary password (TMP-XXXX-YYYY) is generated automatically.</div>
              <div>2. An invitation record is created in the Outbox (visible under Invitations tab).</div>
              <div>3. The student must authenticate with temporary credentials and establish a new password on first login.</div>
            </div>
          )}
        </div>
      </Container>

      {/* Credential Dispatch Confirmation Modal */}
      <Modal
        isOpen={!!credentialModal}
        onClose={() => {
          setCredentialModal(null);
          navigate(ROUTES.TEACHER_STUDENTS);
        }}
        title="Enrollment Complete"
        subtitle="TEMPORARY CREDENTIALS GENERATED"
        maxWidth="max-w-lg"
      >
        {credentialModal && (
          <div className="space-y-5">
            <div className="p-4 border-hairline border-border bg-background space-y-3" style={{ borderRadius: '2px' }}>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  SIMULATED EMAIL DISPATCH
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-border/50 pb-2">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-muted">TO:</span>
                  <span className="font-mono text-xs text-foreground">{credentialModal.student.email}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border/50 pb-2">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-muted">NAME:</span>
                  <span className="font-sans text-sm text-foreground">{credentialModal.student.name}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border/50 pb-2">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-muted">ROLL:</span>
                  <span className="font-mono text-xs text-foreground">{credentialModal.student.rollNumber}</span>
                </div>
              </div>
            </div>

            {/* Temporary Password Block */}
            <div className="relative p-4 border-hairline border-primary bg-primary/5" style={{ borderRadius: '2px' }}>
              <CornerMarkers size={8} strokeWidth={1.5} />
              <div className="flex items-center gap-2 mb-2">
                <KeyRound className="w-4 h-4 text-primary" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">
                  TEMPORARY PASSWORD
                </span>
              </div>
              <div className="flex items-center justify-between">
                <code className="font-mono text-lg font-bold text-foreground tracking-wide">
                  {credentialModal.temporaryPassword}
                </code>
                <button
                  onClick={() => handleCopy(credentialModal.temporaryPassword, 'temp-pass')}
                  className="p-2 text-muted hover:text-foreground border-hairline border-border hover:border-foreground transition-colors"
                  title="Copy password"
                  style={{ borderRadius: '2px' }}
                >
                  {copiedField === 'temp-pass' ? (
                    <Check className="w-4 h-4 text-primary" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className="font-mono text-[9px] text-muted mt-2">
                Student must change this password on first login.
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={() => {
                  setCredentialModal(null);
                  reset();
                }}
              >
                ENROLL ANOTHER
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setCredentialModal(null);
                  navigate(ROUTES.TEACHER_STUDENTS);
                }}
              >
                RETURN TO ROSTER
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </Section>
  );
}
