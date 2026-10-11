import { storageService } from './storageService';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { ROLES, STUDENT_STATUS } from '../constants/roles';
import { activityService } from './activityService';

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

const SESSION_EXPIRY_MS = 15 * 60 * 1000; // 15 minutes of inactivity

export const authService = {
  /**
   * Retrieves active session from localStorage if valid
   */
  getCurrentSession() {
    const session = storageService.get(STORAGE_KEYS.SESSION, null);
    if (!session) return null;

    // Check 15-minute inactivity timeout
    const now = Date.now();
    if (now - session.lastActivity > SESSION_EXPIRY_MS) {
      this.logout();
      return null;
    }

    return session;
  },

  /**
   * Authenticates user against mock teachers or students
   */
  async login(email, password) {
    await delay(180);
    const cleanEmail = email.trim().toLowerCase();

    // 1. Check Faculty (Teachers)
    const teachers = storageService.get(STORAGE_KEYS.TEACHERS, []);
    const matchedTeacher = teachers.find(
      (t) => t.email.toLowerCase() === cleanEmail && t.password === password
    );

    if (matchedTeacher) {
      const sessionUser = {
        id: matchedTeacher.id,
        name: matchedTeacher.name,
        email: matchedTeacher.email,
        role: ROLES.TEACHER,
        department: matchedTeacher.department,
        subject: matchedTeacher.subject,
        avatar: matchedTeacher.avatar,
        lastActivity: Date.now(),
      };

      storageService.set(STORAGE_KEYS.SESSION, sessionUser);
      return sessionUser;
    }

    // 2. Check Students
    const students = storageService.get(STORAGE_KEYS.STUDENTS, []);
    const matchedStudent = students.find(
      (s) => s.email.toLowerCase() === cleanEmail && s.password === password
    );

    if (matchedStudent) {
      if (matchedStudent.status === STUDENT_STATUS.DISABLED) {
        throw new Error('This account has been disabled. Please contact your instructor.');
      }

      const sessionUser = {
        id: matchedStudent.id,
        studentId: matchedStudent.id,
        name: matchedStudent.name,
        email: matchedStudent.email,
        role: ROLES.STUDENT,
        rollNumber: matchedStudent.rollNumber,
        department: matchedStudent.department,
        classGrade: matchedStudent.classGrade,
        phone: matchedStudent.phone,
        bio: matchedStudent.bio,
        status: matchedStudent.status,
        isFirstLogin: matchedStudent.isFirstLogin,
        avatar: matchedStudent.avatar,
        createdAt: matchedStudent.createdAt,
        lastActivity: Date.now(),
      };

      storageService.set(STORAGE_KEYS.SESSION, sessionUser);
      return sessionUser;
    }

    throw new Error('Invalid email or password. Verify credentials.');
  },

  /**
   * Updates lastActivity timestamp to keep session alive
   */
  refreshSessionActivity() {
    const session = storageService.get(STORAGE_KEYS.SESSION, null);
    if (session) {
      session.lastActivity = Date.now();
      storageService.set(STORAGE_KEYS.SESSION, session);
    }
  },

  /**
   * Student forced password change on first login
   */
  async forceChangePassword(studentId, newPassword) {
    await delay(220);
    const students = storageService.get(STORAGE_KEYS.STUDENTS, []);
    const studentIndex = students.findIndex((s) => s.id === studentId);

    if (studentIndex === -1) {
      throw new Error('Student record not found.');
    }

    // Update password, clear isFirstLogin, set status to ACTIVE
    students[studentIndex].password = newPassword;
    students[studentIndex].isFirstLogin = false;
    students[studentIndex].status = STUDENT_STATUS.ACTIVE;

    storageService.set(STORAGE_KEYS.STUDENTS, students);

    // Update current session
    const session = storageService.get(STORAGE_KEYS.SESSION, null);
    if (session && (session.studentId === studentId || session.id === studentId)) {
      session.isFirstLogin = false;
      storageService.set(STORAGE_KEYS.SESSION, session);
    }

    return students[studentIndex];
  },

  /**
   * Student self-service profile update (phone, bio)
   */
  async updateStudentProfile(studentId, { phone, bio }) {
    await delay(200);
    const students = storageService.get(STORAGE_KEYS.STUDENTS, []);
    const studentIndex = students.findIndex((s) => s.id === studentId);

    if (studentIndex === -1) {
      throw new Error('Student record not found.');
    }

    students[studentIndex].phone = phone?.trim() || '—';
    students[studentIndex].bio = bio?.trim() || '';

    storageService.set(STORAGE_KEYS.STUDENTS, students);

    // Update current session
    const session = storageService.get(STORAGE_KEYS.SESSION, null);
    if (session && (session.studentId === studentId || session.id === studentId)) {
      session.phone = students[studentIndex].phone;
      session.bio = students[studentIndex].bio;
      storageService.set(STORAGE_KEYS.SESSION, session);
    }

    await activityService.logActivity({
      type: 'STUDENT_PROFILE_UPDATED',
      title: 'Student Self-Profile Updated',
      description: `${students[studentIndex].name} updated their contact phone / bio details.`,
      actor: students[studentIndex].name,
      studentId,
    });

    return students[studentIndex];
  },

  /**
   * Regular student password update
   */
  async updatePassword(studentId, currentPassword, newPassword) {
    await delay(200);
    const students = storageService.get(STORAGE_KEYS.STUDENTS, []);
    const student = students.find((s) => s.id === studentId);

    if (!student) {
      throw new Error('Student record not found.');
    }

    if (student.password !== currentPassword) {
      throw new Error('Current password does not match.');
    }

    student.password = newPassword;
    storageService.set(STORAGE_KEYS.STUDENTS, students);
    return true;
  },

  /**
   * Simulated Forgot Password request
   */
  async requestPasswordReset(email) {
    await delay(200);
    const cleanEmail = email.trim().toLowerCase();
    const students = storageService.get(STORAGE_KEYS.STUDENTS, []);
    const teachers = storageService.get(STORAGE_KEYS.TEACHERS, []);

    const user = students.find((s) => s.email.toLowerCase() === cleanEmail) ||
                 teachers.find((t) => t.email.toLowerCase() === cleanEmail);

    if (!user) {
      throw new Error('No registered account found with this Gmail address.');
    }

    return {
      success: true,
      email: cleanEmail,
      message: 'Simulated password reset instructions dispatched to your mailbox.',
    };
  },

  /**
   * Clear session
   */
  logout() {
    storageService.remove(STORAGE_KEYS.SESSION);
  },
};
