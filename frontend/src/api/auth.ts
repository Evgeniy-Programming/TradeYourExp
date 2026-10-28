import { instance, unwrap } from '.';
import type { IChangePassword, ILogin, IRegister } from '../types/auth';
import type { IEditProfile, IProfile } from '../types/profile';

// Профиль в формате бэкенда (backend/internal/models/user.go: ProfileRequest)
interface ApiProfile {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  socialLink: string;
  created_at: string;
}

const fromApiProfile = (profile: ApiProfile): IProfile => ({
  id: profile.id,
  username: profile.username,
  email: profile.email,
  firstName: profile.firstName || null,
  lastName: profile.lastName || null,
  link: profile.socialLink || null,
  createdAt: profile.created_at,
});

export const authAPI = {
  registration: ({ link, ...data }: IRegister) =>
    unwrap<unknown>(instance.post('register', { ...data, socialLink: link })),
  // бэкенд сам распознаёт email в поле username
  login: ({ login, password }: ILogin) =>
    unwrap<unknown>(instance.post('login', { username: login, password })),
  logout: () => unwrap<unknown>(instance.post('logout')),
  changePassword: (data: IChangePassword) =>
    unwrap<unknown>(instance.put('users/me/password', data)),
  update: ({ link, ...data }: IEditProfile) =>
    unwrap<unknown>(instance.put('users/me', { ...data, socialLink: link })),
  getMe: () => unwrap<ApiProfile>(instance.get('users/me')).then(fromApiProfile),
  getProfile: (username: string) =>
    unwrap<ApiProfile>(instance.get(`users/profile/${encodeURIComponent(username)}`)).then(
      fromApiProfile
    ),
};
