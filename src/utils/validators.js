import { z } from 'zod';
import { ROLES } from '../constants/roles';

// Gmail regex enforcing standard @gmail.com domain
export const GMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .regex(GMAIL_REGEX, 'Must be a valid @gmail.com address');

export const studentSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  rollNumber: z.string().trim().min(2, 'Roll number is required'),
  classGrade: z.string().trim().min(1, 'Class is required'),
  department: z.string().trim().min(1, 'Department is required'),
  phone: z.string().trim().optional(),
});

export const studentSelfEditSchema = z.object({
  phone: z.string().trim().optional(),
  bio: z.string().trim().max(500, 'Bio must be under 500 characters').optional(),
});

export const accessRequestSchema = z.object({
  name: z.string().trim().min(2, 'Full name is required'),
  email: emailSchema,
  role: z.enum([ROLES.TEACHER, ROLES.STUDENT], {
    errorMap: () => ({ message: 'Please select a role' }),
  }),
  rollNumber: z.string().trim().min(2, 'Roll number is required'),
  department: z.string().trim().min(1, 'Department is required'),
  classGrade: z.string().trim().min(1, 'Class / Cohort is required'),
  phone: z.string().trim().optional(),
  bio: z.string().trim().optional(),
  message: z.string().trim().optional(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const forcePasswordChangeSchema = z.object({
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});
