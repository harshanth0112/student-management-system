import { storageService } from './storageService';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { ACCESS_REQUEST_STATUS, ROLES } from '../constants/roles';
import { generateId, generateRefCode } from '../utils/idGenerator';
import { activityService } from './activityService';
import { studentService } from './studentService';

const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));

export const accessRequestService = {
  /**
   * Retrieves all access requests (Teacher view)
   */
  async getAccessRequests() {
    await delay(120);
    return storageService.get(STORAGE_KEYS.ACCESS_REQUESTS, []);
  },

  /**
   * Submits a public request-access form entry with complete student details
   */
  async submitRequest({
    name,
    email,
    role = ROLES.STUDENT,
    rollNumber = '',
    department = '',
    classGrade = '',
    phone = '',
    bio = '',
    message = '',
  }) {
    await delay(220);
    const requests = storageService.get(STORAGE_KEYS.ACCESS_REQUESTS, []);

    const newRequest = {
      id: generateId('req'),
      refCode: generateRefCode(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      rollNumber: rollNumber.trim().toUpperCase(),
      department: department.trim(),
      classGrade: classGrade.trim(),
      phone: phone.trim() || '—',
      bio: bio.trim() || 'Self-registered student applicant.',
      message: message.trim(),
      status: ACCESS_REQUEST_STATUS.NEW,
      createdAt: new Date().toISOString(),
    };

    requests.unshift(newRequest);
    storageService.set(STORAGE_KEYS.ACCESS_REQUESTS, requests);

    await activityService.logActivity({
      type: 'ACCESS_REQUEST_SUBMITTED',
      title: 'Access Request Received',
      description: `${newRequest.name} (${newRequest.email}) submitted full applicant profile [${role.toUpperCase()}].`,
      actor: 'Public Visitor',
    });

    return newRequest;
  },

  /**
   * Marks request as contacted
   */
  async markContacted(requestId) {
    await delay(150);
    const requests = storageService.get(STORAGE_KEYS.ACCESS_REQUESTS, []);
    const index = requests.findIndex((r) => r.id === requestId);

    if (index === -1) {
      throw new Error(`Request ${requestId} not found.`);
    }

    requests[index].status = ACCESS_REQUEST_STATUS.CONTACTED;
    storageService.set(STORAGE_KEYS.ACCESS_REQUESTS, requests);
    return requests[index];
  },

  /**
   * Admin 1-Click Approve: Enrolls student directly into roster,
   * generates temporary password, creates invitation outbox entry,
   * logs activity, and marks request as APPROVED.
   */
  async approveRequest(requestId) {
    await delay(250);
    const requests = storageService.get(STORAGE_KEYS.ACCESS_REQUESTS, []);
    const index = requests.findIndex((r) => r.id === requestId);

    if (index === -1) {
      throw new Error(`Request ${requestId} not found.`);
    }

    const req = requests[index];
    const students = storageService.get(STORAGE_KEYS.STUDENTS, []);

    // 1. If already marked as approved, find existing student or construct fallback object
    if (req.status === ACCESS_REQUEST_STATUS.APPROVED) {
      const existing = students.find(
        (s) => s.id === req.studentId || (s.email && s.email.toLowerCase() === req.email.toLowerCase())
      );
      const studentRecord = existing || {
        id: req.studentId || req.id,
        name: req.name,
        rollNumber: req.rollNumber || '—',
        department: req.department || '—',
        email: req.email,
      };

      return {
        request: req,
        student: studentRecord,
        temporaryPassword: req.temporaryPassword || existing?.password || '—',
        alreadyApproved: true,
      };
    }

    // 2. Check if student already exists in the roster by email or rollNumber
    const existingStudent = students.find(
      (s) =>
        (s.email && s.email.toLowerCase() === req.email.toLowerCase()) ||
        (req.rollNumber && s.rollNumber && s.rollNumber.toUpperCase() === req.rollNumber.toUpperCase())
    );

    let enrolmentResult;
    if (existingStudent) {
      // Connect request to existing student record
      enrolmentResult = {
        student: existingStudent,
        temporaryPassword: existingStudent.password || 'TEMP-EXISTING-KEY',
        invitation: null,
      };
    } else {
      // Enroll fresh student into roster
      enrolmentResult = await studentService.addStudent({
        name: req.name,
        email: req.email,
        rollNumber: req.rollNumber || `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
        department: req.department || 'Computer Science',
        classGrade: req.classGrade || 'Year 1 - Section A',
        phone: req.phone || '—',
        bio: req.bio || req.message || 'Approved via public access intake.',
      });
    }

    // Mark as APPROVED in access requests list
    requests[index] = {
      ...requests[index],
      status: ACCESS_REQUEST_STATUS.APPROVED,
      approvedAt: new Date().toISOString(),
      studentId: enrolmentResult.student.id,
      temporaryPassword: enrolmentResult.temporaryPassword,
    };

    storageService.set(STORAGE_KEYS.ACCESS_REQUESTS, requests);

    await activityService.logActivity({
      type: 'ACCESS_REQUEST_APPROVED',
      title: 'Access Request Approved',
      description: `Admin approved ${req.name} (${req.email}). Student enrolled with temporary key.`,
      actor: 'Teacher / Faculty',
      studentId: enrolmentResult.student.id,
    });

    return {
      request: requests[index],
      student: enrolmentResult.student,
      temporaryPassword: enrolmentResult.temporaryPassword,
      invitation: enrolmentResult.invitation,
    };
  },
};
