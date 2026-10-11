import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStudents } from '../../hooks/useStudents';
import { useFavourites } from '../../hooks/useFavourites';
import { usePagination } from '../../hooks/usePagination';
import { useDebounce } from '../../hooks/useDebounce';
import { Container } from '../../components/ui/Container';
import { Section } from '../../components/ui/Section';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Pagination } from '../../components/ui/Pagination';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { ROUTES } from '../../constants/routes';
import { STUDENT_STATUS } from '../../constants/roles';
import { formatDate, formatRollNumber } from '../../utils/formatters';
import {
  Search, Plus, Eye, Pencil, Trash2, Heart, HeartOff,
  Users, Filter, ChevronDown, ChevronUp, UserX,
} from 'lucide-react';

const DEPARTMENTS = [
  { value: '', label: 'All Departments' },
  { value: 'Computer Science', label: 'Computer Science' },
  { value: 'Electrical Engineering', label: 'Electrical Engineering' },
  { value: 'Mechanical Engineering', label: 'Mechanical Engineering' },
  { value: 'Mathematics', label: 'Mathematics' },
];

const STATUSES = [
  { value: '', label: 'All Statuses' },
  { value: STUDENT_STATUS.ACTIVE, label: 'Active' },
  { value: STUDENT_STATUS.INVITED, label: 'Invited' },
  { value: STUDENT_STATUS.DISABLED, label: 'Disabled' },
];

const STATUS_BADGE_MAP = {
  [STUDENT_STATUS.ACTIVE]: 'active',
  [STUDENT_STATUS.INVITED]: 'invited',
  [STUDENT_STATUS.DISABLED]: 'disabled',
};

export default function StudentListPage() {
  const navigate = useNavigate();
  const { students, isLoading, deleteStudent, toggleDisableStudent } = useStudents();
  const { isFavourite, toggleFavourite } = useFavourites();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 250);

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    let result = [...students];

    // Search filter
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

    // Department filter
    if (filterDept) {
      result = result.filter((s) => s.department === filterDept);
    }

    // Status filter
    if (filterStatus) {
      result = result.filter((s) => s.status === filterStatus);
    }

    // Sort
    result.sort((a, b) => {
      let aVal = a[sortField] || '';
      let bVal = b[sortField] || '';
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [students, debouncedSearch, filterDept, filterStatus, sortField, sortDirection]);

  const {
    paginatedItems,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    pageSize,
  } = usePagination(filteredStudents, 8);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteStudent(deleteTarget.id);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleToggleDisable = async (student) => {
    await toggleDisableStudent(student.id);
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-3 h-3 inline ml-0.5" />
    ) : (
      <ChevronDown className="w-3 h-3 inline ml-0.5" />
    );
  };

  const activeCount = students.filter((s) => s.status === STUDENT_STATUS.ACTIVE).length;
  const invitedCount = students.filter((s) => s.status === STUDENT_STATUS.INVITED).length;
  const disabledCount = students.filter((s) => s.status === STUDENT_STATUS.DISABLED).length;

  if (isLoading) {
    return (
      <Section>
        <Container>
          <div className="space-y-4 py-8">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-full" />
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
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
        <div className="py-6 sm:py-8 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">
                TEACHER // STUDENT ROSTER
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Student Directory
              </h1>
            </div>
            <Link to={ROUTES.TEACHER_STUDENT_NEW}>
              <Button variant="primary">
                <Plus className="w-3.5 h-3.5 mr-1" />
                ADD STUDENT
              </Button>
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border border-hairline border-border" style={{ borderRadius: '2px' }}>
            <div className="bg-background p-4 flex items-center gap-3">
              <Users className="w-4 h-4 text-primary" />
              <div>
                <div className="font-display text-xl font-bold text-foreground">{students.length}</div>
                <div className="font-mono text-[9px] uppercase tracking-widest text-muted">TOTAL</div>
              </div>
            </div>
            <div className="bg-background p-4 flex items-center gap-3">
              <span className="w-2 h-2 bg-[var(--color-status-active)]" />
              <div>
                <div className="font-display text-xl font-bold text-foreground">{activeCount}</div>
                <div className="font-mono text-[9px] uppercase tracking-widest text-muted">ACTIVE</div>
              </div>
            </div>
            <div className="bg-background p-4 flex items-center gap-3">
              <span className="w-2 h-2 bg-[var(--color-status-invited-dot)]" />
              <div>
                <div className="font-display text-xl font-bold text-foreground">{invitedCount}</div>
                <div className="font-mono text-[9px] uppercase tracking-widest text-muted">INVITED</div>
              </div>
            </div>
            <div className="bg-background p-4 flex items-center gap-3">
              <span className="w-2 h-2 bg-[var(--color-status-disabled-dot)]" />
              <div>
                <div className="font-display text-xl font-bold text-foreground">{disabledCount}</div>
                <div className="font-mono text-[9px] uppercase tracking-widest text-muted">DISABLED</div>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Search by name, email, roll number, or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  rightElement={<Search className="w-4 h-4" />}
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="sm:w-auto"
              >
                <Filter className="w-3.5 h-3.5 mr-1.5" />
                {filtersOpen ? 'HIDE FILTERS' : 'FILTERS'}
                {(filterDept || filterStatus) && (
                  <span className="ml-1.5 w-1.5 h-1.5 bg-primary" />
                )}
              </Button>
            </div>

            {filtersOpen && (
              <div className="flex flex-col sm:flex-row gap-3 p-4 border-hairline border-border bg-surface" style={{ borderRadius: '2px' }}>
                <div className="flex-1">
                  <Select
                    label="Department"
                    options={DEPARTMENTS}
                    value={filterDept}
                    onChange={(e) => { setFilterDept(e.target.value); setCurrentPage(1); }}
                    placeholder=""
                  />
                </div>
                <div className="flex-1">
                  <Select
                    label="Status"
                    options={STATUSES}
                    value={filterStatus}
                    onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                    placeholder=""
                  />
                </div>
                {(filterDept || filterStatus) && (
                  <div className="flex items-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setFilterDept(''); setFilterStatus(''); setCurrentPage(1); }}
                    >
                      CLEAR
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
            SHOWING {filteredStudents.length} OF {students.length} RECORDS
            {debouncedSearch && <span> • QUERY: "{debouncedSearch.toUpperCase()}"</span>}
          </div>

          {/* Student Table */}
          {filteredStudents.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No students found"
              description={
                debouncedSearch || filterDept || filterStatus
                  ? 'Try adjusting your search or filters.'
                  : 'Add your first student to the roster.'
              }
              actionLabel={!debouncedSearch && !filterDept && !filterStatus ? 'ADD STUDENT' : undefined}
              onAction={!debouncedSearch && !filterDept && !filterStatus ? () => navigate(ROUTES.TEACHER_STUDENT_NEW) : undefined}
            />
          ) : (
            <div className="border-hairline border-border overflow-x-auto" style={{ borderRadius: '2px' }}>
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="bg-surface border-b border-border">
                    <th className="w-8" />
                    <th
                      className="text-left py-3 px-4 font-mono text-[10px] uppercase tracking-widest text-muted cursor-pointer hover:text-foreground transition-colors select-none"
                      onClick={() => handleSort('name')}
                    >
                      NAME <SortIcon field="name" />
                    </th>
                    <th
                      className="text-left py-3 px-4 font-mono text-[10px] uppercase tracking-widest text-muted cursor-pointer hover:text-foreground transition-colors select-none hidden md:table-cell"
                      onClick={() => handleSort('rollNumber')}
                    >
                      ROLL # <SortIcon field="rollNumber" />
                    </th>
                    <th
                      className="text-left py-3 px-4 font-mono text-[10px] uppercase tracking-widest text-muted cursor-pointer hover:text-foreground transition-colors select-none hidden lg:table-cell"
                      onClick={() => handleSort('department')}
                    >
                      DEPARTMENT <SortIcon field="department" />
                    </th>
                    <th
                      className="text-left py-3 px-4 font-mono text-[10px] uppercase tracking-widest text-muted cursor-pointer hover:text-foreground transition-colors select-none"
                      onClick={() => handleSort('status')}
                    >
                      STATUS <SortIcon field="status" />
                    </th>
                    <th className="text-right py-3 px-4 font-mono text-[10px] uppercase tracking-widest text-muted">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.map((student) => {
                    const fav = isFavourite(student.id);
                    return (
                      <tr
                        key={student.id}
                        className="border-b border-border/50 hover:bg-surface/50 transition-colors duration-150 group"
                      >
                        {/* Favourite Toggle */}
                        <td className="py-3 px-2 text-center">
                          <button
                            onClick={() => toggleFavourite(student.id)}
                            className={`p-1 transition-colors duration-150 ${
                              fav
                                ? 'text-[var(--color-accent-coral)]'
                                : 'text-muted/30 hover:text-[var(--color-accent-coral)]'
                            }`}
                            title={fav ? 'Remove from favourites' : 'Add to favourites'}
                          >
                            {fav ? (
                              <Heart className="w-4 h-4 fill-current" />
                            ) : (
                              <Heart className="w-4 h-4" />
                            )}
                          </button>
                        </td>

                        {/* Name + Email */}
                        <td className="py-3 px-4">
                          <Link
                            to={`/teacher/students/${student.id}`}
                            className="flex items-center gap-3 group/name"
                          >
                            <Avatar name={student.name} size="sm" />
                            <div className="min-w-0">
                              <div className="font-sans text-sm font-medium text-foreground group-hover/name:text-primary transition-colors truncate">
                                {student.name}
                              </div>
                              <div className="font-mono text-[10px] text-muted truncate">
                                {student.email}
                              </div>
                            </div>
                          </Link>
                        </td>

                        {/* Roll Number */}
                        <td className="py-3 px-4 hidden md:table-cell">
                          <span className="font-mono text-xs text-foreground">
                            {formatRollNumber(student.rollNumber)}
                          </span>
                        </td>

                        {/* Department */}
                        <td className="py-3 px-4 hidden lg:table-cell">
                          <span className="font-sans text-xs text-muted">
                            {student.department}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4">
                          <Badge variant={STATUS_BADGE_MAP[student.status] || 'default'}>
                            {student.status}
                          </Badge>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              to={`/teacher/students/${student.id}`}
                              className="p-1.5 text-muted hover:text-foreground hover:bg-surface border-hairline border-transparent hover:border-border transition-colors"
                              title="View Details"
                              style={{ borderRadius: '2px' }}
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Link>
                            <Link
                              to={`/teacher/students/${student.id}/edit`}
                              className="p-1.5 text-muted hover:text-foreground hover:bg-surface border-hairline border-transparent hover:border-border transition-colors"
                              title="Edit Student"
                              style={{ borderRadius: '2px' }}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              onClick={() => handleToggleDisable(student)}
                              className="p-1.5 text-muted hover:text-foreground hover:bg-surface border-hairline border-transparent hover:border-border transition-colors"
                              title={student.status === STUDENT_STATUS.DISABLED ? 'Re-enable' : 'Disable'}
                              style={{ borderRadius: '2px' }}
                            >
                              <UserX className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(student)}
                              className="p-1.5 text-muted hover:text-[var(--color-danger)] hover:bg-surface border-hairline border-transparent hover:border-border transition-colors"
                              title="Delete"
                              style={{ borderRadius: '2px' }}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={totalItems}
            pageSize={pageSize}
          />
        </div>
      </Container>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Student Record"
        message={`This action will permanently remove ${deleteTarget?.name || 'this student'} from the roster. This cannot be undone. The student will also be removed from your favourites list.`}
        confirmText="DELETE PERMANENTLY"
        cancelText="CANCEL"
        variant="danger"
        isLoading={isDeleting}
      />
    </Section>
  );
}
