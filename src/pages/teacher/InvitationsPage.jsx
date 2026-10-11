import React, { useState, useEffect } from 'react';
import { Section } from '../../components/ui/Section';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { CornerMarkers } from '../../components/ui/CornerMarkers';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import { invitationService } from '../../services/invitationService';
import { accessRequestService } from '../../services/accessRequestService';
import { storageService } from '../../services/storageService';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import { formatDate } from '../../utils/formatters';
import { RefreshCw, Copy, Check, UserPlus, Inbox, Send, CheckCircle2, ShieldCheck, KeyRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import toast from 'react-hot-toast';

export default function InvitationsPage() {
  const [activeTab, setActiveTab] = useState('requests'); // default to 'requests' so teacher sees incoming applications
  const [invitations, setInvitations] = useState([]);
  const [accessRequests, setAccessRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resendingId, setResendingId] = useState(null);
  const [approvingId, setApprovingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Approval Success Modal State
  const [approvalModalData, setApprovalModalData] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [invData, reqData] = await Promise.all([
        invitationService.getInvitations(),
        accessRequestService.getAccessRequests(),
      ]);
      setInvitations(invData);
      setAccessRequests(reqData);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load credentials telemetry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Centralized store listener: sync automatically if invitations or requests change
    const unsubscribe = storageService.subscribe((key) => {
      if (
        key === STORAGE_KEYS.INVITATIONS ||
        key === STORAGE_KEYS.ACCESS_REQUESTS ||
        key === STORAGE_KEYS.STUDENTS ||
        key === '*'
      ) {
        fetchData();
      }
    });

    return unsubscribe;
  }, []);

  const handleResend = async (id) => {
    setResendingId(id);
    try {
      const updated = await invitationService.resendInvitation(id);
      setInvitations((prev) => prev.map((item) => (item.id === id ? updated : item)));
      toast.success('Invitation resent with new temporary key');
    } catch (err) {
      toast.error(err.message || 'Resend failed');
    } finally {
      setResendingId(null);
    }
  };

  const handle1ClickApprove = async (request) => {
    setApprovingId(request.id);
    try {
      const result = await accessRequestService.approveRequest(request.id);
      toast.success(`Enrolled & Approved: ${request.name}`);
      
      // Update local state
      setAccessRequests((prev) =>
        prev.map((item) => (item.id === request.id ? result.request : item))
      );

      // Open credentials confirmation modal with temporary password
      setApprovalModalData({
        student: result.student || {
          name: request.name,
          rollNumber: request.rollNumber || '—',
          department: request.department || '—',
          email: request.email,
        },
        temporaryPassword: result.temporaryPassword || request.temporaryPassword || '—',
        refCode: request.refCode || 'REQ-APPROVED',
      });

      // Refresh invitations outbox in background
      const updatedInvs = await invitationService.getInvitations();
      setInvitations(updatedInvs);
    } catch (err) {
      toast.error(err.message || 'Approval failed');
    } finally {
      setApprovingId(null);
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <Section className="py-8 space-y-6">
        <Skeleton className="h-10 w-64" style={{ borderRadius: '2px' }} />
        <Skeleton className="h-64" style={{ borderRadius: '2px' }} />
      </Section>
    );
  }

  const newRequestsCount = accessRequests.filter((r) => r.status === 'NEW').length;

  return (
    <Section className="py-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
            CREDENTIAL & ONBOARDING TELEMETRY
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Invitations & Intake Approvals
          </h1>
        </div>

        <Button variant="outline" size="sm" onClick={fetchData}>
          <RefreshCw className="w-3.5 h-3.5 mr-2" /> REFRESH
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3 mb-6 font-mono text-xs">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-3.5 py-1.5 transition-colors border-hairline uppercase tracking-wider flex items-center gap-2 ${
            activeTab === 'requests'
              ? 'border-primary bg-primary text-[var(--color-primary-text)] font-semibold'
              : 'border-border text-muted hover:text-foreground hover:bg-surface'
          }`}
          style={{ borderRadius: '2px' }}
        >
          <Inbox className="w-3.5 h-3.5" />
          <span>INCOMING APPLICATIONS</span>
          {newRequestsCount > 0 ? (
            <span className="bg-[var(--color-accent-gold)] text-black px-1.5 py-0.2 text-[10px] font-bold">
              {newRequestsCount} PENDING
            </span>
          ) : (
            <span className="opacity-80">[{accessRequests.length}]</span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('outbox')}
          className={`px-3.5 py-1.5 transition-colors border-hairline uppercase tracking-wider flex items-center gap-2 ${
            activeTab === 'outbox'
              ? 'border-primary bg-primary text-[var(--color-primary-text)] font-semibold'
              : 'border-border text-muted hover:text-foreground hover:bg-surface'
          }`}
          style={{ borderRadius: '2px' }}
        >
          <Send className="w-3.5 h-3.5" />
          <span>OUTBOX DISPATCHES</span>
          <span className="opacity-80">[{invitations.length}]</span>
        </button>
      </div>

      {/* Tab 1: Incoming Requests & 1-Click Approval */}
      {activeTab === 'requests' && (
        <>
          {accessRequests.length === 0 ? (
            <div className="border-hairline border-border bg-surface p-12 relative" style={{ borderRadius: '2px' }}>
              <CornerMarkers size={10} strokeWidth={1.5} />
              <EmptyState
                title="No Access Requests"
                description="Public visitor applications submitted via the landing page form will appear here for 1-click approval."
              />
            </div>
          ) : (
            <div className="border-hairline border-border bg-surface relative" style={{ borderRadius: '2px' }}>
              <CornerMarkers size={8} strokeWidth={1} />
              
              <div className="p-4 border-b border-border flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
                  APPLICATION INTAKE REGISTER // {accessRequests.length} ENTRIES
                </span>
                <span className="font-mono text-[10px] text-muted">1-CLICK DIRECT ENROLMENT</span>
              </div>

              <div className="divide-y divide-border/60">
                {accessRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 hover:bg-surface-hover/40 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-5"
                  >
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-display font-semibold text-foreground text-base">
                          {req.name}
                        </span>
                        <code className="font-mono text-[10px] text-primary bg-primary/5 px-2 py-0.5 border-hairline border-primary/30" style={{ borderRadius: '2px' }}>
                          {req.refCode}
                        </code>
                        <Badge variant={req.status === 'APPROVED' ? 'active' : 'invited'}>
                          {req.status}
                        </Badge>
                      </div>

                      {/* Applicant Full Telemetry Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs bg-background/60 p-3 border-hairline border-border/40" style={{ borderRadius: '2px' }}>
                        <div>
                          <div className="text-[9px] uppercase tracking-widest text-muted">EMAIL</div>
                          <div className="text-foreground truncate">{req.email}</div>
                        </div>
                        <div>
                          <div className="text-[9px] uppercase tracking-widest text-muted">ROLL NUMBER</div>
                          <div className="text-foreground">{req.rollNumber || '—'}</div>
                        </div>
                        <div>
                          <div className="text-[9px] uppercase tracking-widest text-muted">DEPARTMENT</div>
                          <div className="text-foreground">{req.department || 'Computer Science'}</div>
                        </div>
                        <div>
                          <div className="text-[9px] uppercase tracking-widest text-muted">CLASS</div>
                          <div className="text-foreground">{req.classGrade || 'Cohort 2026'}</div>
                        </div>
                      </div>

                      {req.bio && (
                        <p className="font-sans text-xs text-muted leading-relaxed">
                          <strong>Bio:</strong> {req.bio}
                        </p>
                      )}

                      {req.status === 'APPROVED' && req.temporaryPassword && (
                        <div className="flex items-center gap-2 text-xs font-mono text-primary pt-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>ENROLLED // TEMP PASSWORD:</span>
                          <code className="bg-background px-2 py-0.5 border-hairline border-border text-foreground font-bold" style={{ borderRadius: '2px' }}>
                            {req.temporaryPassword}
                          </code>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-1">
                      {req.status !== 'APPROVED' ? (
                        <Button
                          variant="primary"
                          size="sm"
                          isLoading={approvingId === req.id}
                          onClick={() => handle1ClickApprove(req)}
                          className="bg-primary text-[var(--color-primary-text)] font-semibold"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                          1-CLICK APPROVE
                        </Button>
                      ) : (
                        <Link to={`${ROUTES.TEACHER_STUDENTS}/${req.studentId || ''}`}>
                          <Button variant="outline" size="sm">
                            VIEW IN ROSTER
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Tab 2: Outbox Dispatches */}
      {activeTab === 'outbox' && (
        <>
          {invitations.length === 0 ? (
            <div className="border-hairline border-border bg-surface p-12 relative" style={{ borderRadius: '2px' }}>
              <CornerMarkers size={10} strokeWidth={1.5} />
              <EmptyState
                title="No Invitations Dispatched"
                description="When new students are enrolled with temporary access passwords, invitation dispatches appear here."
              />
            </div>
          ) : (
            <div className="border-hairline border-border bg-surface relative" style={{ borderRadius: '2px' }}>
              <CornerMarkers size={8} strokeWidth={1} />
              
              <div className="p-4 border-b border-border flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
                  DISPATCH QUEUE // {invitations.length} RECORDS
                </span>
                <span className="font-mono text-[10px] text-muted">TOKEN EXPIRY: 30 DAYS</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-background/50 font-mono text-[10px] uppercase tracking-widest text-muted">
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Roll Number</th>
                      <th className="py-3 px-4">Sent At</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Temp Password</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-sm">
                    {invitations.map((inv) => (
                      <tr key={inv.id} className="hover:bg-surface-hover/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-display font-medium text-foreground">{inv.name}</div>
                          <div className="font-mono text-xs text-muted truncate max-w-[200px]">{inv.email}</div>
                        </td>
                        <td className="py-3 px-4 font-mono text-xs text-muted">
                          {inv.rollNumber}
                        </td>
                        <td className="py-3 px-4 font-mono text-xs text-muted">
                          {formatDate(inv.sentAt, true)}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={inv.status === 'CLAIMED' ? 'active' : 'invited'}>
                            {inv.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-mono text-xs">
                          <div className="flex items-center gap-2">
                            <code className="bg-background px-2 py-1 border-hairline border-border" style={{ borderRadius: '2px' }}>
                              {inv.temporaryPassword}
                            </code>
                            <button
                              onClick={() => handleCopy(inv.id, inv.temporaryPassword)}
                              className="p-1 text-muted hover:text-foreground transition-colors"
                              title="Copy temporary password"
                            >
                              {copiedId === inv.id ? (
                                <Check className="w-3.5 h-3.5 text-primary" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            isLoading={resendingId === inv.id}
                            onClick={() => handleResend(inv.id)}
                          >
                            <RefreshCw className="w-3 h-3 mr-1.5" /> RESEND
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* 1-Click Approval Confirmation Modal */}
      {approvalModalData && (
        <Modal
          isOpen={!!approvalModalData}
          onClose={() => setApprovalModalData(null)}
          title="Student Approved & Enrolled"
          subtitle={`INTAKE REF: ${approvalModalData?.refCode || 'RECORD'} // ROSTER SYNC COMPLETE`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-5">
            <div className="p-4 border-hairline border-primary/30 bg-primary/5 space-y-2" style={{ borderRadius: '2px' }}>
              <div className="font-display font-semibold text-foreground text-base">
                {approvalModalData?.student?.name || 'Enrolled Student'}
              </div>
              <div className="font-mono text-xs text-muted">
                {approvalModalData?.student?.rollNumber || '—'} • {approvalModalData?.student?.department || 'Department Registered'}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
                TEMPORARY ONBOARDING KEY
              </div>
              <div className="flex items-center gap-2 p-3 border-hairline border-border bg-background" style={{ borderRadius: '2px' }}>
                <KeyRound className="w-4 h-4 text-primary shrink-0" />
                <code className="font-mono text-sm font-bold text-foreground flex-1">
                  {approvalModalData?.temporaryPassword || '—'}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy('modal-pwd', approvalModalData?.temporaryPassword || '')}
                >
                  {copiedId === 'modal-pwd' ? (
                    <span className="flex items-center gap-1 text-primary">
                      <Check className="w-3.5 h-3.5" /> COPIED
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Copy className="w-3.5 h-3.5" /> COPY
                    </span>
                  )}
                </Button>
              </div>
              <p className="font-sans text-xs text-muted pt-1">
                The student can log in directly with their registered Gmail and this key. They will be prompted to set their private password upon entry.
              </p>
            </div>

            <div className="pt-3 border-t border-border flex justify-end gap-3">
              <Button
                variant="primary"
                onClick={() => setApprovalModalData(null)}
              >
                DONE
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Section>
  );
}
