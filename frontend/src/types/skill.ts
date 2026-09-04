export interface IAddSkill {
  category: string;
  exchange: string;
  skill: string;
  username: string;
}

export interface ISkill {
  id: string;
  category: string;
  description: string;
  skill: string;
  exchange: string;
  media: string;
  username: string;
  avatarUsername: string | null;
  createdAt: string;
}
