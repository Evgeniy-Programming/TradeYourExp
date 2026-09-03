import { redirect } from 'react-router-dom';
import { store } from '../../store';

export const requireAuth = async () => {
  const { profile } = store.getState().profile;

  if (!profile) {
    throw redirect('/login');
  }

  return null;
};

export const requireGuest = async () => {
  const { profile } = store.getState().profile;

  if (profile) {
    throw redirect('/');
  }

  return null;
};
