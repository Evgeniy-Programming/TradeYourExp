export interface IRegister {
  password: string;
  email: string;
  firstName: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IChangePassword {
  currentPassword: string;
  newPassword: string;
}
