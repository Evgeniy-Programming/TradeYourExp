import { instance } from '.';

export const authAPI = {
  registration: (data: RegisterType) => instance.post('auth/register', data),
  login: (data: LoginType) => instance.post(`auth/login`, data),
  logout: () => instance.post(`auth/logout`),
};

export interface RegisterType {
  password: string;
  email: string;
  firstName: string;
}

export interface LoginType {
  email: string;
  password: string;
}

export interface ChangePasswordType {
  currentPassword: string;
  newPassword: string;
}
