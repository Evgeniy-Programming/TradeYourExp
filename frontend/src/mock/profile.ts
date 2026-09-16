import type { IProfile, IProfileStats, IProfileView } from '../types/profile';

export const MockProfile: IProfile = {
  username: 'Test',
  firstName: 'Test',
  createdAt: Date.now(),
  lastName: 'Test',
  email: 'test@mail.ru',
  id: '42343',
  link: 'http://localhost:5173/profile',
};

export const MockProfileStats: IProfileStats = {
  raiting: 4,
  activeSkills: 2,
  closedSkills: 2,
  uniquePartners: 2,
  successSkills: 50,
};

export const MockProfileView: IProfileView[] = [
  {
    id: '1',
    username: 'tester1',
    firstName: 'firstName',
    lastName: 'lastName',
    link: 'https://localhost:5173/profile',
    createdAt: '2026-08-05T13:04:00.426504Z',
    stats: {
      raiting: 3,
      activeSkills: 1,
      closedSkills: 12,
      uniquePartners: 10,
      successSkills: 11,
    },
  },
  {
    id: '2',
    username: 'tester2',
    firstName: 'firstName',
    lastName: 'lastName',
    link: 'http://localhost:5173/profile',
    createdAt: '2026-08-05T13:04:00.426504Z',
    stats: {
      raiting: 4,
      activeSkills: 2,
      closedSkills: 40,
      uniquePartners: 35,
      successSkills: 40,
    },
  },
  {
    id: '3',
    username: 'tester3',
    firstName: 'firstName',
    lastName: 'lastName',
    link: 'https://localhost:5173/profile',
    createdAt: '2026-08-05T13:04:00.426504Z',
    stats: {
      raiting: 2,
      activeSkills: 1,
      closedSkills: 5,
      uniquePartners: 5,
      successSkills: 1,
    },
  },
  {
    id: '4',
    username: 'tester4',
    firstName: 'firstName',
    lastName: 'lastName',
    link: 'https://localhost:5173/profile',
    createdAt: '2026-08-05T13:04:00.426504Z',
    stats: {
      raiting: 5,
      activeSkills: 5,
      closedSkills: 52,
      uniquePartners: 40,
      successSkills: 49,
    },
  },
];
