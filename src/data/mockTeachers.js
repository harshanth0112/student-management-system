import { ROLES } from '../constants/roles';

export const mockTeachers = [
  {
    id: 'tch_01',
    name: 'Dr. Evelyn Reed',
    email: 'evelyn.reed@gmail.com',
    password: 'password123', // Demo password
    role: ROLES.TEACHER,
    avatar: null,
    subject: 'Computer Science & Software Architecture',
    department: 'Computer Science',
    createdAt: '2026-01-10T09:00:00.000Z',
  },
  {
    id: 'tch_02',
    name: 'Prof. Julian Vance',
    email: 'julian.vance@gmail.com',
    password: 'password123',
    role: ROLES.TEACHER,
    avatar: null,
    subject: 'Applied Mathematics & Algorithms',
    department: 'Mathematics',
    createdAt: '2026-01-12T10:30:00.000Z',
  },
];
