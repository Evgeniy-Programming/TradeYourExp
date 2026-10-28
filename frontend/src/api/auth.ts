import { instance, unwrap } from '.';
import type { IChangePassword, ILogin, IRegister } from '../types/auth';
import type { IEditProfile, IProfile } from '../types/profile';

export const authAPI = {
  registration: (data: IRegister) => unwrap<IProfile>(instance.post('auth/register', data)),
  login: (data: ILogin) => unwrap<IProfile>(instance.post('auth/login', data)),
  logout: () => unwrap<null>(instance.post('auth/logout')),
  changePassword: (data: IChangePassword) =>
    unwrap<null>(instance.post('auth/changepassword', data)),
  update: (data: IEditProfile) => unwrap<IProfile>(instance.put('auth/update', data)),
  getMe: () => unwrap<IProfile>(instance.get('auth/me')),
  getProfile: (username: string) =>
    unwrap<IProfile>(instance.get(`auth/profile/${encodeURIComponent(username)}`)),
};
