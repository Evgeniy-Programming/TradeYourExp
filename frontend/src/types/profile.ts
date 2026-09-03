export interface IProfile {
  id: string;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  link: string;
  createdAt: string | number;
}
