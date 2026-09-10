export interface IRegister {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  link?: string;
}

export interface ILogin {
  type: LoginType;
  login: string;
  password: string;
}

export type LoginType = 'email' | 'username';

export interface IChangePassword {
  currentPassword: string;
  newPassword: string;
}
