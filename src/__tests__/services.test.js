import { describe, it, expect, beforeEach } from 'vitest';
import { storageService } from '../services/storageService';
import { authService } from '../services/authService';
import { studentService } from '../services/studentService';
import { favouritesService } from '../services/favouritesService';
import { ROLES, STUDENT_STATUS } from '../constants/roles';

describe('Local Storage & Service Isolation Layer', () => {
  beforeEach(() => {
    storageService.resetAll();
  });

  it('authenticates teacher with valid mock credentials', async () => {
    const teacher = await authService.login('evelyn.reed@gmail.com', 'password123');
    expect(teacher).toBeDefined();
    expect(teacher.role).toBe(ROLES.TEACHER);
    expect(teacher.name).toBe('Dr. Evelyn Reed');
  });

  it('authenticates student with valid mock credentials', async () => {
    const student = await authService.login('alex.turner@gmail.com', 'password123');
    expect(student).toBeDefined();
    expect(student.role).toBe(ROLES.STUDENT);
    expect(student.rollNumber).toBe('CS-2026-001');
  });

  it('rejects invalid password credentials', async () => {
    await expect(authService.login('evelyn.reed@gmail.com', 'wrongpassword')).rejects.toThrow();
  });

  it('retrieves default roster of mock students', async () => {
    const students = await studentService.getAllStudents();
    expect(students.length).toBeGreaterThanOrEqual(20);
    expect(students[0]).toHaveProperty('id');
    expect(students[0]).toHaveProperty('rollNumber');
    expect(students[0]).toHaveProperty('status');
  });

  it('creates and manages favourite students', async () => {
    const students = await studentService.getAllStudents();
    const targetStudentId = students[0].id;

    // Toggle on or off
    const initialFavs = await favouritesService.getFavourites();
    const wasFav = initialFavs.includes(targetStudentId);

    const updatedFavs = await favouritesService.toggleFavourite(targetStudentId);
    expect(updatedFavs.includes(targetStudentId)).toBe(!wasFav);

    const revertedFavs = await favouritesService.toggleFavourite(targetStudentId);
    expect(revertedFavs.includes(targetStudentId)).toBe(wasFav);
  });

  it('toggles student disabled status', async () => {
    const students = await studentService.getAllStudents();
    const testStudent = students[0];
    const initialStatus = testStudent.status;

    const toggled = await studentService.toggleDisableStudent(testStudent.id);
    expect(toggled.status).not.toBe(initialStatus);

    // Toggle back
    const reverted = await studentService.toggleDisableStudent(testStudent.id);
    expect(reverted.status).toBe(initialStatus);
  });
});
