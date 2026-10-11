import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStudents } from '../../hooks/useStudents';
import { useFavourites } from '../../hooks/useFavourites';
import { Section } from '../../components/ui/Section';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { CornerMarkers } from '../../components/ui/CornerMarkers';
import { ROUTES } from '../../constants/routes';
import { STUDENT_STATUS } from '../../constants/roles';
import { useDebounce } from '../../hooks/useDebounce';
import { Search, Heart, Eye, ArrowLeft, Mail, Phone, BookOpen, Trash2 } from 'lucide-react';

const STATUS_BADGE_MAP = {
  [STUDENT_STATUS.ACTIVE]: 'active',
  [STUDENT_STATUS.INVITED]: 'invited',
  [STUDENT_STATUS.DISABLED]: 'disabled',
};

export default function FavouritesPage() {
  const { students, isLoading } = useStudents();
  const { favouriteIds, isLoading: favLoading, toggleFavourite, clearAllFavourites, favouritesCount } = useFavourites();

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 250);

  const favouriteStudents = useMemo(() => {
    let result = students.filter((s) => favouriteIds.includes(s.id));
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.rollNumber.toLowerCase().includes(q) ||
          s.department.toLowerCase().includes(q)
      );
    }
    return result;
  }, [students, favouriteIds, debouncedSearch]);

  const handleRemove = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavourite(id);
  };

  if (isLoading || favLoading) {
    return (
      <Section className="pb-16">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" style={{ borderRadius: '2px' }} />
            <Skeleton className="h-10 w-32" style={{ borderRadius: '2px' }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-40" style={{ borderRadius: '2px' }} />
            ))}
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section className="pb-16">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Link
              to={ROUTES.TEACHER_STUDENTS}
              className="p-2 text-muted hover:text-foreground border-hairline border-transparent hover:border-border transition-colors"
              title="Back to Roster"
              style={{ borderRadius: '2px' }}
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted">PRIVATE SHORTLIST</div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Favourites <span className="text-primary font-mono text-xl">[{favouritesCount}]</span>
              </h1>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {favouritesCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (window.confirm('Remove all students from your favourites?')) {
                    clearAllFavourites();
                  }
                }}
              >
                CLEAR ALL
              </Button>
            )}
            <Link to={ROUTES.TEACHER_STUDENTS}>
              <Button variant="primary" size="sm">
                VIEW FULL ROSTER
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter Bar */}
        {favouriteIds.length > 0 && (
          <div className="max-w-md">
            <Input
              placeholder="Search favourites by name, email, roll..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
        )}
      </div>

      {/* Main Content */}
      {favouriteIds.length === 0 ? (
        <div className="border-hairline border-border bg-surface p-12 relative" style={{ borderRadius: '2px' }}>
          <CornerMarkers size={10} strokeWidth={1.5} />
          <EmptyState
            title="No favourite students added yet"
            description="Star students from the roster or student profile to create your quick-access shortlist."
            action={
              <Link to={ROUTES.TEACHER_STUDENTS}>
                <Button variant="primary" size="sm">
                  BROWSE STUDENTS
                </Button>
              </Link>
            }
          />
        </div>
      ) : favouriteStudents.length === 0 ? (
        <div className="border-hairline border-border bg-surface p-8 relative" style={{ borderRadius: '2px' }}>
          <CornerMarkers size={8} strokeWidth={1.5} />
          <EmptyState
            title="No matches found"
            description={`No favourite students matched query "${searchQuery}".`}
            action={
              <Button variant="outline" size="sm" onClick={() => setSearchQuery('')}>
                CLEAR SEARCH
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favouriteStudents.map((student) => (
            <div
              key={student.id}
              className="group relative border-hairline border-border bg-surface p-5 hover:border-foreground transition-colors flex flex-col justify-between"
              style={{ borderRadius: '2px' }}
            >
              <CornerMarkers size={6} strokeWidth={1} />
              
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={student.name} size="md" src={student.avatar} />
                    <div>
                      <Link
                        to={`${ROUTES.TEACHER_STUDENTS}/${student.id}`}
                        className="font-display font-semibold text-foreground hover:text-primary transition-colors text-base line-clamp-1"
                      >
                        {student.name}
                      </Link>
                      <div className="font-mono text-[11px] text-muted">{student.rollNumber}</div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleRemove(e, student.id)}
                    className="p-1.5 text-[var(--color-accent-coral)] hover:bg-[var(--color-accent-coral)]/10 transition-colors"
                    title="Remove from favourites"
                    style={{ borderRadius: '2px' }}
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>

                <div className="space-y-2 mb-4 font-mono text-xs">
                  <div className="flex items-center justify-between text-muted pb-1 border-b border-border/50">
                    <span className="text-[10px] uppercase tracking-wider">DEPT</span>
                    <span className="text-foreground font-sans text-xs">{student.department}</span>
                  </div>
                  <div className="flex items-center justify-between text-muted pb-1 border-b border-border/50">
                    <span className="text-[10px] uppercase tracking-wider">STATUS</span>
                    <Badge variant={STATUS_BADGE_MAP[student.status] || 'default'}>
                      {student.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted pt-1 truncate">
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{student.email}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                <Link
                  to={`${ROUTES.TEACHER_STUDENTS}/${student.id}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 border-hairline border-border text-foreground hover:border-foreground text-[11px] font-mono uppercase tracking-wider transition-colors"
                  style={{ borderRadius: '2px' }}
                >
                  <Eye className="w-3.5 h-3.5" /> VIEW
                </Link>
                <Link
                  to={ROUTES.TEACHER_STUDENT_EDIT.replace(':id', student.id)}
                  className="inline-flex items-center justify-center py-1.5 px-3 border-hairline border-border text-muted hover:text-foreground hover:border-foreground text-[11px] font-mono uppercase tracking-wider transition-colors"
                  style={{ borderRadius: '2px' }}
                  title="Edit Student"
                >
                  EDIT
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}