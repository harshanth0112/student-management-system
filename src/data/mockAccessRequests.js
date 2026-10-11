import { ACCESS_REQUEST_STATUS, ROLES } from '../constants/roles';

export const mockAccessRequests = [
  {
    id: 'req_01',
    refCode: 'REQ-AK8912',
    name: 'Julian Hayes',
    email: 'julian.hayes@gmail.com',
    role: ROLES.STUDENT,
    message: 'Enrolled in Spring EE-2026. Requesting access to course dashboard.',
    status: ACCESS_REQUEST_STATUS.NEW,
    createdAt: '2026-02-14T09:25:00.000Z',
  },
  {
    id: 'req_02',
    refCode: 'REQ-PL4091',
    name: 'Dr. Alistair MacIntyre',
    email: 'alistair.macintyre@gmail.com',
    role: ROLES.TEACHER,
    message: 'Guest lecturer for Embedded Systems 401. Requesting instructor portal login.',
    status: ACCESS_REQUEST_STATUS.CONTACTED,
    createdAt: '2026-02-12T14:10:00.000Z',
  },
  {
    id: 'req_03',
    refCode: 'REQ-ZT1843',
    name: 'Nadia Volkova',
    email: 'nadia.volkova@gmail.com',
    role: ROLES.STUDENT,
    message: 'Transfer student from Zurich Polytech. Computer Science major.',
    status: ACCESS_REQUEST_STATUS.NEW,
    createdAt: '2026-02-15T08:45:00.000Z',
  },
];
