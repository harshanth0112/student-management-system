import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStudents } from '../../hooks/useStudents';
import { useFavourites } from '../../hooks/useFavourites';
import { Section } from '../../components/ui/Section';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Modal } from '../../components/ui/Modal';
import { CornerMarkers } from '../../components/ui/CornerMarkers';
import { Skeleton } from '../../components/ui/Skeleton';
import { ROUTES } from '../../constants/routes';
import { STUDENT_STATUS } from '../../constants/roles';
import { formatDate } from '../../utils/formatters';
import { ArrowLeft, Heart, HeartOff, Pencil, Trash2, Copy, Mail, Calendar, Shield, BookOpen, UserX, Edit2 } from 'lucide-react';

export default function StudentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { students, isLoading: studentsLoading, deleteStudent, toggleDisableStudent } = useStudents();
  const { isFavourite, toggleFavourite } = useFavourites();

  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [disableOpen, setDisableOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingDisable, setIsTogglingDisable] = useState(false);

  useEffect(() => {
    if (!studentsLoading && students.length > 0) {
      const found = students.find((s) => s.id === id);
      if (found) setStudent(found);
      else navigate(ROUTES.TEACHER_STUDENTS);
      setIsLoading(false);
    } else if (!studentsLoading && students.length === 0) {
      setIsLoading(false);
    }
  }, [students, studentsLoading, id, navigate]);

  const handleCopy = (text) => navigator.clipboard.writeText(text).then(() => {});

  const handleToggleFavourite = async () => { if (!student) return; await toggleFavourite(student.id); };

  const handleToggleDisable = async () => { if (!student) return; setDisableOpen(false); setIsTogglingDisable(true); try { await toggleDisableStudent(student.id); } finally { setIsTogglingDisable(false); } };

  const handleDelete = async () => { if (!student) return; setDeleteOpen(false); setIsDeleting(true); try { await deleteStudent(student.id); navigate(ROUTES.TEACHER_STUDENTS); } finally { setIsDeleting(false); } };

  const STATUS_BADGE_MAP = { [STUDENT_STATUS.ACTIVE]: 'active', [STUDENT_STATUS.INVITED]: 'invited', [STUDENT_STATUS.DISABLED]: 'disabled' };

  if (isLoading || !student) {
    return (
      <Section>
        <div className="space-y-6">
          <div className="flex items-center gap-4"><Skeleton className="w-16 h-16" style={{ borderRadius: '2px' }} /><div className="flex-1 space-y-3"><Skeleton className="h-8 w-1/3" style={{ borderRadius: '2px' }} /><Skeleton className="h-4 w-1/4" style={{ borderRadius: '2px' }} /></div></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => (<Skeleton key={i} className="h-24" style={{ borderRadius: '2px' }} />))}</div>
        </div>
      </Section>
    );
  }

  const isFav = isFavourite(student.id);

  return (
    <Section className="pb-16">
      {/* Header */}
      <div className="mb-8">
        <Link to={ROUTES.TEACHER_STUDENTS} className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span className="font-mono text-[11px] uppercase tracking-widest">BACK TO ROSTER</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex items-start gap-5">
            <Avatar name={student.name} size="xl" src={student.avatar} />
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">{student.name}</h1>
                <Badge variant={STATUS_BADGE_MAP[student.status] || 'default'}>{student.status.toUpperCase()}</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted">
                <span className="font-mono text-[11px]">{student.rollNumber}</span>
                <span className="hidden sm:inline-flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{student.email}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Link to={`${ROUTES.TEACHER_STUDENT_EDIT}/${student.id}`} className="inline-flex items-center gap-2 px-4 py-2 border-hairline border-border bg-background text-sm font-mono text-[11px] uppercase tracking-widest hover:border-foreground hover:text-foreground transition-colors" style={{ borderRadius: '2px' }}>
              <Edit2 className="w-3.5 h-3.5" /> EDIT
            </Link>
            <button onClick={handleToggleFavourite} className="inline-flex items-center gap-2 px-4 py-2 border-hairline transition-colors font-mono text-[11px] uppercase tracking-widest" style={{ borderRadius: '2px', backgroundColor: isFav ? 'var(--color-accent-coral)' : 'transparent', borderColor: isFav ? 'var(--color-accent-coral)' : 'var(--color-border)', color: isFav ? 'var(--color-primary-text)' : 'var(--color-foreground)' }}>
              {isFav ? <Heart className="w-3.5 h-3.5 fill-current" /> : <HeartOff className="w-3.5 h-3.5" />}
              {isFav ? 'REMOVE FROM FAVOURITES' : 'ADD TO FAVOURITES'}
            </button>
            <button onClick={() => setDisableOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 border-hairline border-[var(--color-status-disabled)]/50 text-[var(--color-status-disabled)] bg-[var(--color-status-disabled)]/5 text-sm font-mono text-[11px] uppercase tracking-widest hover:bg-[var(--color-status-disabled)]/10 transition-colors" style={{ borderRadius: '2px' }}>
              <UserX className="w-3.5 h-3.5" /> {student.status === STUDENT_STATUS.DISABLED ? 'RE-ENABLE' : 'DISABLE'}
            </button>
            <button onClick={() => setDeleteOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 border-hairline border-[var(--color-danger)]/50 text-[var(--color-danger)] bg-[var(--color-danger)]/5 text-sm font-mono text-[11px] uppercase tracking-widest hover:bg-[var(--color-danger)]/10 transition-colors" style={{ borderRadius: '2px' }}>
              <Trash2 className="w-3.5 h-3.5" /> DELETE
            </button>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Main Info Card */}
        <div className="lg:col-span-8 space-y-4">
          {/* Academic Details */}
          <div className="border-hairline border-border bg-surface p-6 relative" style={{ borderRadius: '2px' }}>
            <CornerMarkers size={8} strokeWidth={1.5} />
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border">
              <BookOpen className="w-4.5 h-4.5 text-primary" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary">ACADEMIC PROFILE</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1"><div className="font-mono text-[9px] uppercase tracking-widest text-muted">DEPARTMENT</div><div className="font-sans text-sm text-foreground">{student.department}</div></div>
              <div className="space-y-1"><div className="font-mono text-[9px] uppercase tracking-widest text-muted">CLASS / GRADE</div><div className="font-sans text-sm text-foreground">{student.classGrade}</div></div>
              <div className="space-y-1"><div className="font-mono text-[9px] uppercase tracking-widest text-muted">ROLL NUMBER</div><div className="flex items-center gap-2"><code className="font-mono text-sm text-foreground bg-surface px-2 py-1 border-hairline border-border" style={{ borderRadius: '2px' }}>{student.rollNumber}</code><button onClick={() => handleCopy(student.rollNumber)} className="p-1.5 text-muted hover:text-foreground border-hairline border-transparent hover:border-border transition-colors" title="Copy roll number" style={{ borderRadius: '2px' }}><Copy className="w-3.5 h-3.5" /></button></div></div>
              <div className="space-y-1"><div className="font-mono text-[9px] uppercase tracking-widest text-muted">STATUS SINCE</div><div className="font-sans text-sm text-foreground">{student.createdAt ? formatDate(student.createdAt) : '—'}</div></div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="border-hairline border-border bg-surface p-6 relative" style={{ borderRadius: '2px' }}>
            <CornerMarkers size={8} strokeWidth={1.5} />
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border">
              <Mail className="w-4.5 h-4.5 text-primary" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary">CONTACT INFORMATION</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1"><div className="font-mono text-[9px] uppercase tracking-widest text-muted">EMAIL</div><div className="flex items-center gap-2 flex-wrap"><span className="font-mono text-sm text-foreground break-all">{student.email}</span><button onClick={() => handleCopy(student.email)} className="p-1.5 text-muted hover:text-foreground border-hairline border-transparent hover:border-border transition-colors shrink-0" title="Copy email" style={{ borderRadius: '2px' }}><Copy className="w-3.5 h-3.5" /></button></div></div>
              <div className="space-y-1"><div className="font-mono text-[9px] uppercase tracking-widest text-muted">PHONE</div><div className="flex items-center gap-2 flex-wrap"><span className="font-mono text-sm text-foreground">{student.phone || '—'}</span>{student.phone && student.phone !== '—' && <button onClick={() => handleCopy(student.phone)} className="p-1.5 text-muted hover:text-foreground border-hairline border-transparent hover:border-border transition-colors shrink-0" title="Copy phone" style={{ borderRadius: '2px' }}><Copy className="w-3.5 h-3.5" /></button>}</div></div>
            </div>
          </div>

          {/* Bio / Notes */}
          <div className="border-hairline border-border bg-surface p-6 relative" style={{ borderRadius: '2px' }}>
            <CornerMarkers size={8} strokeWidth={1.5} />
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border">
              <Shield className="w-4.5 h-4.5 text-primary" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary">STUDENT BIO</span>
            </div>
            <p className="font-sans text-sm text-muted leading-relaxed whitespace-pre-wrap">{student.bio || 'No bio provided.'}</p>
          </div>
        </div>

        {/* Sidebar - System Info */}
        <div className="lg:col-span-4 space-y-4">
          <div className="border-hairline border-border bg-surface p-6 relative sticky top-24" style={{ borderRadius: '2px' }}>
            <CornerMarkers size={8} strokeWidth={1.5} />
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border">
              <Calendar className="w-4.5 h-4.5 text-primary" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary">SYSTEM RECORD</span>
            </div>
            <div className="space-y-4">
              <div className="space-y-1"><div className="font-mono text-[9px] uppercase tracking-widest text-muted">RECORD ID</div><div className="flex items-center gap-2"><code className="font-mono text-xs text-foreground bg-surface-hover px-2 py-1 border-hairline border-border flex-1 truncate" style={{ borderRadius: '2px' }}>{student.id}</code><button onClick={() => handleCopy(student.id)} className="p-1.5 text-muted hover:text-foreground border-hairline border-transparent hover:border-border transition-colors shrink-0" title="Copy ID" style={{ borderRadius: '2px' }}><Copy className="w-3.5 h-3.5" /></button></div></div>
              <div className="space-y-1"><div className="font-mono text-[9px] uppercase tracking-widest text-muted">CREATED</div><div className="font-mono text-sm text-foreground">{student.createdAt ? formatDate(student.createdAt, true) : '—'}</div></div>
              <div className="space-y-1"><div className="font-mono text-[9px] uppercase tracking-widest text-muted">AUTH STATE</div><div className="flex items-center gap-2"><Badge variant={student.isFirstLogin ? 'invited' : 'active'}>{student.isFirstLogin ? 'FIRST LOGIN PENDING' : 'PASSWORD ESTABLISHED'}</Badge></div></div>
              <div className="space-y-1"><div className="font-mono text-[9px] uppercase tracking-widest text-muted">FAVOURITE STATUS</div><div className="flex items-center gap-2"><Badge variant={isFav ? 'active' : 'neutral'}>{isFav ? 'BOOKMARKED' : 'NOT BOOKMARKED'}</Badge></div></div>
            </div>

            {/* Danger Zone in Sidebar */}
            <div className="mt-6 pt-6 border-t border-border space-y-3">
              <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-danger)]">DANGER ZONE</div>
              <div className="font-sans text-xs text-muted leading-relaxed">Deleting this record is permanent. The student will be removed from all rosters, favourites, and invitation history.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Disable Confirmation Modal */}
      <Modal isOpen={disableOpen} onClose={() => setDisableOpen(false)} title={student.status === STUDENT_STATUS.DISABLED ? 'Re-enable Student' : 'Disable Student'} subtitle={student.status === STUDENT_STATUS.DISABLED ? 'RESTORE ACCESS // STUDENT WILL REGAIN PORTAL ENTRY' : 'REVOKE ACCESS // STUDENT WILL LOSE PORTAL ENTRY'} maxWidth="max-w-md">
        <div className="space-y-4">
          <p className="font-sans text-sm text-foreground/80 leading-relaxed">{student.status === STUDENT_STATUS.DISABLED ? `This will restore ${student.name}'s access to the student portal. They will be able to log in with their established password.` : `This will disable ${student.name}'s account. They will no longer be able to access the student portal until re-enabled.`}</p>
          <div className="pt-2 border-t border-border"><div className="flex flex-col-reverse sm:flex-row justify-end gap-3"><Button variant="outline" onClick={() => setDisableOpen(false)} className="w-full sm:w-auto">CANCEL</Button><Button variant={student.status === STUDENT_STATUS.DISABLED ? 'primary' : 'danger'} onClick={handleToggleDisable} isLoading={isTogglingDisable} className="w-full sm:w-auto">{student.status === STUDENT_STATUS.DISABLED ? 'RE-ENABLE ACCOUNT' : 'DISABLE ACCOUNT'}</Button></div></div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete Student Record" subtitle="PERMANENT ACTION // CANNOT BE UNDONE" maxWidth="max-w-md">
        <div className="space-y-4">
          <p className="font-sans text-sm text-foreground/80 leading-relaxed">This action will permanently remove <strong>{student.name}</strong> ({student.rollNumber}) from the roster. This cannot be undone. The student will also be removed from your favourites list and all associated invitation records will be purged.</p>
          <div className="p-3 border-hairline border-[var(--color-danger)]/30 bg-[var(--color-danger)]/5 font-mono text-[10px] text-[var(--color-danger)]" style={{ borderRadius: '2px' }}>TYPE STUDENT NAME TO CONFIRM: {student.name}</div>
          <div className="pt-2 border-t border-border"><div className="flex flex-col-reverse sm:flex-row justify-end gap-3"><Button variant="outline" onClick={() => setDeleteOpen(false)} className="w-full sm:w-auto" disabled={isDeleting}>CANCEL</Button><Button variant="danger" onClick={handleDelete} isLoading={isDeleting} className="w-full sm:w-auto">DELETE PERMANENTLY</Button></div></div>
        </div>
      </Modal>
    </Section>
  );
}
