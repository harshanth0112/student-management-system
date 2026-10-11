export const landingContent = {
  hero: {
    badge: 'PROTOTYPE // SIMULATED DIRECTORY',
    titleLine1: 'Structural precision.',
    titleLine2: 'Role-enforced control.',
    description: 'An invite-only student directory system. Instructors curate and favourite class rosters with architectural clarity; students authenticate securely to view only their own record.',
    primaryCta: '01. ACCESS PORTAL',
    secondaryCta: '02. REQUEST ACCESS',
    credentialsLabel: 'VIEW DEMO CREDENTIALS',
  },
  statsCaption: 'Figures directly derived from active prototype seed state.',
  workflow: {
    sectionNumber: '02',
    sectionTitle: 'SYSTEM ARCHITECTURE // HOW IT WORKS',
    steps: [
      {
        id: '01',
        title: 'Teacher Adds a Student',
        description: 'Instructor enters student Gmail, department, and roll number. The system verifies domain constraints and generates a cryptographic one-time temporary key.',
        previewType: 'form',
      },
      {
        id: '02',
        title: 'Student Accepts Invite',
        description: 'Student authenticates with temporary credentials. A security guard halts portal access until the student establishes their personal private password.',
        previewType: 'email',
      },
      {
        id: '03',
        title: 'Teacher Curates Favourites',
        description: 'Instructors toggle heart bookmarks to isolate active research candidates or high-priority pupils in a strictly teacher-only context.',
        previewType: 'favourites',
      },
    ],
  },
  roles: {
    sectionNumber: '03',
    sectionTitle: 'ACCESS BOUNDARIES // STRICT ISOLATION',
    teachers: {
      title: 'For Teachers',
      subtitle: 'Complete institutional visibility and private shortlists',
      benefits: [
        {
          title: 'INVITE BY GMAIL',
          description: 'Onboard pupils with strict email domain validation and automated one-time passkeys.',
        },
        {
          title: 'PRIVATE FAVOURITES',
          description: 'Bookmark high-priority students into an isolated context hidden from the student body.',
        },
        {
          title: 'TELEMETRY AT A GLANCE',
          description: 'Inspect class distribution, invitation statuses, and real-time audit logs from one terminal.',
        },
      ],
    },
    students: {
      title: 'For Students',
      subtitle: 'Zero access to external rosters or class peers',
      benefits: [
        {
          title: 'ONLY YOUR PROFILE',
          description: 'Students can never inspect the class roster, search peers, or discover instructor bookmarks.',
        },
        {
          title: 'FORCED FIRST LOGIN',
          description: 'Guaranteed security: temporary passwords must be updated on initial authentication.',
        },
        {
          title: 'FACULTY NOTICES',
          description: 'Receive real-time institutional broadcasts and midterm dates directly from department heads.',
        },
      ],
    },
  },
  requestAccess: {
    sectionNumber: '04',
    sectionTitle: 'REQUEST SYSTEM ACCESS',
    heading: 'Join Directory Roster',
    subheading: 'Invite-only deployment. Institutional faculty will review your request before dispatching temporary credentials.',
  },
  footer: {
    disclaimer: 'Prototype deployment: authentication, role guards, and email dispatches are simulated client-side with localStorage persistence.',
  },
};
