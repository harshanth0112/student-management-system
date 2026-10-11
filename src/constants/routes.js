export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  UNAUTHORIZED: '/unauthorized',
  
  // Teacher
  TEACHER: '/teacher',
  TEACHER_DASHBOARD: '/teacher/dashboard',
  TEACHER_STUDENTS: '/teacher/students',
  TEACHER_STUDENT_NEW: '/teacher/students/new',
  TEACHER_STUDENT_EDIT: '/teacher/students/:id/edit',
  TEACHER_STUDENT_DETAIL: '/teacher/students/:id',
  TEACHER_FAVOURITES: '/teacher/favourites',
  TEACHER_INVITATIONS: '/teacher/invitations',
  TEACHER_ACTIVITY: '/teacher/activity',

  // Student
  STUDENT: '/student',
  STUDENT_DASHBOARD: '/student/dashboard',
  STUDENT_PROFILE: '/student/profile',
  STUDENT_FORCE_PASSWORD: '/student/force-password-change',

  // Dev
  DESIGN_PREVIEW: '/design-preview',
};
