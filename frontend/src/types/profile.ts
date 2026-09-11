export interface IProfile {
  id: string;
  username: string;
  email: string;
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

export interface IProfileStats {
  raiting: number;
  activeSkills: number;
  closedSkills: number;
  uniquePartners: number;
  successSkills: number;
}
