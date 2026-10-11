import { storageService } from './storageService';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { INVITATION_STATUS } from '../data/mockInvitations';
import { generateId } from '../utils/idGenerator';
import { generateTemporaryPassword } from '../utils/passwordGenerator';
import { activityService } from './activityService';

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

export const invitationService = {
  /**
   * Retrieves all outbox invitations
   */
  async getInvitations() {
    await delay(120);
    return storageService.get(STORAGE_KEYS.INVITATIONS, []);
  },

  /**
   * Dispatches and logs a new student invitation
   */
  async createInvitation({ studentId, name, email, rollNumber, temporaryPassword }) {
    const invitations = storageService.get(STORAGE_KEYS.INVITATIONS, []);
    const newInvitation = {
      id: generateId('inv'),
      studentId,
      name,
      email,
      rollNumber,
      temporaryPassword,
      status: INVITATION_STATUS.SENT,
      sentAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    invitations.unshift(newInvitation);
    storageService.set(STORAGE_KEYS.INVITATIONS, invitations);
    return newInvitation;
  },

  /**
   * Resends invitation with a freshly generated temporary password
   */
  async resendInvitation(invitationId) {
    await delay(200);
    const invitations = storageService.get(STORAGE_KEYS.INVITATIONS, []);
    const index = invitations.findIndex((inv) => inv.id === invitationId);

    if (index === -1) {
      throw new Error(`Invitation ${invitationId} not found.`);
    }

    const newTempPassword = generateTemporaryPassword();
    invitations[index] = {
      ...invitations[index],
      temporaryPassword: newTempPassword,
      status: INVITATION_STATUS.SENT,
      sentAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    storageService.set(STORAGE_KEYS.INVITATIONS, invitations);

    // If student exists, update password and reset isFirstLogin
    if (invitations[index].studentId) {
      const students = storageService.get(STORAGE_KEYS.STUDENTS, []);
      const studentIndex = students.findIndex((s) => s.id === invitations[index].studentId);
      if (studentIndex !== -1) {
        students[studentIndex].password = newTempPassword;
        students[studentIndex].isFirstLogin = true;
        storageService.set(STORAGE_KEYS.STUDENTS, students);
      }
    }

    await activityService.logActivity({
      type: 'INVITATION_RESENT',
      title: 'Resent Invitation',
      description: `Dispatched fresh credentials to ${invitations[index].email}.`,
      studentId: invitations[index].studentId,
    });

    return invitations[index];
  },
};
