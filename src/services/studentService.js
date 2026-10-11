import { storageService } from './storageService';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { STUDENT_STATUS } from '../constants/roles';
import { generateId } from '../utils/idGenerator';
import { generateTemporaryPassword } from '../utils/passwordGenerator';
import { favouritesService } from './favouritesService';
import { invitationService } from './invitationService';
import { activityService } from './activityService';

const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));

export const studentService = {
  /**
   * Retrieves full student roster (Teacher only)
   */
  async getAllStudents() {
    await delay(150);
    return storageService.get(STORAGE_KEYS.STUDENTS, []);
  },

  /**
   * Retrieves single student record by ID (Used by both Teacher and Student Dashboard)
   */
  async getStudentById(id) {
    await delay(120);
    const students = storageService.get(STORAGE_KEYS.STUDENTS, []);
    const student = students.find((s) => s.id === id);
    if (!student) {
      throw new Error(`Student with ID ${id} not found.`);
    }
    return student;
  },

  /**
   * Creates a new student record (Teacher only)
   */
  async addStudent(studentData) {
    await delay(220);
    const students = storageService.get(STORAGE_KEYS.STUDENTS, []);

    const cleanEmail = studentData.email.trim().toLowerCase();
    const cleanRoll = studentData.rollNumber.trim().toUpperCase();

    // 1. Uniqueness check for Gmail
    if (students.some((s) => s.email.toLowerCase() === cleanEmail)) {
      throw new Error('A student with this Gmail address already exists.');
    }

    // 2. Uniqueness check for Roll Number
    if (students.some((s) => s.rollNumber.toUpperCase() === cleanRoll)) {
      throw new Error('A student with this Roll Number already exists.');
    }

    const tempPassword = generateTemporaryPassword();
    const newStudent = {
      id: generateId('std'),
      name: studentData.name.trim(),
      email: cleanEmail,
      rollNumber: cleanRoll,
      classGrade: studentData.classGrade.trim(),
      department: studentData.department.trim(),
      phone: studentData.phone?.trim() || '—',
      status: STUDENT_STATUS.INVITED,
      password: tempPassword,
      isFirstLogin: true,
      bio: studentData.bio || 'New student candidate.',
      avatar: null,
      createdAt: new Date().toISOString(),
    };

    students.unshift(newStudent);
    storageService.set(STORAGE_KEYS.STUDENTS, students);

    // Create Outbox Invitation record
    const invitation = await invitationService.createInvitation({
      studentId: newStudent.id,
      name: newStudent.name,
      email: newStudent.email,
      rollNumber: newStudent.rollNumber,
      temporaryPassword: tempPassword,
    });

    // Log Activity
    await activityService.logActivity({
      type: 'STUDENT_ENROLLED',
      title: 'Enrolled Student',
      description: `Added ${newStudent.name} (${newStudent.rollNumber}) to ${newStudent.department}.`,
      studentId: newStudent.id,
    });

    return {
      student: newStudent,
      invitation,
      temporaryPassword: tempPassword,
    };
  },

  /**
   * Updates student information
   */
  async updateStudent(id, updateData) {
    await delay(180);
    const students = storageService.get(STORAGE_KEYS.STUDENTS, []);
    const index = students.findIndex((s) => s.id === id);

    if (index === -1) {
      throw new Error(`Student with ID ${id} not found.`);
    }

    // Roll number uniqueness check if altered
    if (updateData.rollNumber) {
      const cleanRoll = updateData.rollNumber.trim().toUpperCase();
      const duplicate = students.find((s) => s.id !== id && s.rollNumber.toUpperCase() === cleanRoll);
      if (duplicate) {
        throw new Error('Another student already has this Roll Number.');
      }
      updateData.rollNumber = cleanRoll;
    }

    students[index] = {
      ...students[index],
      ...updateData,
    };

    storageService.set(STORAGE_KEYS.STUDENTS, students);

    await activityService.logActivity({
      type: 'STUDENT_UPDATED',
      title: 'Record Updated',
      description: `Updated profile details for ${students[index].name}.`,
      studentId: id,
    });

    return students[index];
  },

  /**
   * Toggles student disabled/active status
   */
  async toggleDisableStudent(id) {
    await delay(180);
    const students = storageService.get(STORAGE_KEYS.STUDENTS, []);
    const student = students.find((s) => s.id === id);

    if (!student) {
      throw new Error(`Student with ID ${id} not found.`);
    }

    const newStatus = student.status === STUDENT_STATUS.DISABLED 
      ? STUDENT_STATUS.ACTIVE 
      : STUDENT_STATUS.DISABLED;

    student.status = newStatus;
    storageService.set(STORAGE_KEYS.STUDENTS, students);

    await activityService.logActivity({
      type: newStatus === STUDENT_STATUS.DISABLED ? 'STUDENT_DISABLED' : 'STUDENT_ACTIVATED',
      title: newStatus === STUDENT_STATUS.DISABLED ? 'Account Disabled' : 'Account Re-enabled',
      description: `Changed status of ${student.name} to ${newStatus.toUpperCase()}.`,
      studentId: id,
    });

    return student;
  },

  /**
   * Deletes a student permanently
   * In accordance with rule #3: Deleting a student removes them from favourites.
   */
  async deleteStudent(id) {
    await delay(200);
    const students = storageService.get(STORAGE_KEYS.STUDENTS, []);
    const targetStudent = students.find((s) => s.id === id);

    if (!targetStudent) {
      throw new Error(`Student with ID ${id} not found.`);
    }

    const filtered = students.filter((s) => s.id !== id);
    storageService.set(STORAGE_KEYS.STUDENTS, filtered);

    // Rule 3: Clean up favourites
    await favouritesService.removeFavourite(id);

    // Log Activity
    await activityService.logActivity({
      type: 'STUDENT_DELETED',
      title: 'Record Deleted',
      description: `Permanently removed ${targetStudent.name} (${targetStudent.rollNumber}).`,
      studentId: id,
    });

    return true;
  },
};
