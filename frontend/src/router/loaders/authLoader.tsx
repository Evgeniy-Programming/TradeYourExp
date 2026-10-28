import { redirect } from 'react-router-dom';
import { store } from '../../store';
import { fetchProfile } from '../../store/slices/profileSlice';

// Лоадеры родительского и дочернего маршрута запускаются параллельно — профиль запрашиваем один раз
let profileRequest: Promise<unknown> | null = null;

const ensureProfile = async () => {
  if (!store.getState().profile.isInitialized) {
    profileRequest ??= store.dispatch(fetchProfile()).finally(() => {
      profileRequest = null;
    });
    await profileRequest;
  }

  return store.getState().profile.profile;
};

export const loadProfile = async () => {
  await ensureProfile();
  return null;
};

export const requireAuth = async () => {
  const profile = await ensureProfile();

  if (!profile) {
    throw redirect('/login');
  }

  return null;
};

export const requireGuest = async () => {
  const profile = await ensureProfile();

  if (profile) {
    throw redirect('/');
  }

  return null;
};
