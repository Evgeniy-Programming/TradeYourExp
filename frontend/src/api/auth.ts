import { instance } from '.';
import type { IChangePassword, ILogin, IRegister } from '../types/auth';

export const authAPI = {
  registration: (data: IRegister) => instance.post('auth/register', data),
  login: (data: ILogin) => instance.post(`auth/login`, data),
  logout: () => instance.post(`auth/logout`),
  changePassword: (data: IChangePassword) => instance.post(`auth/changepassword`, data),
};
