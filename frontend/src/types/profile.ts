export interface IProfile {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
  firstName: string | null;
  lastName: string | null;
  link: string | null;
  createdAt: string | number;
}

export interface IEditProfile {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  link?: string;
}
