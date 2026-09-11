import type { categories, categoriesView } from '../constants/categories';
import type { skillStatus } from '../constants/skills';

export interface ISkill {
  id: string;
  category: CategoryViewType;
  description: string;
  skill: string;
  exchange: string;
  contactType: ContactType;
  contactValue: string | null;
  username: string;
  avatarUsername: string | null;
  createdAt: string;
}

export interface ISkillHistory extends ISkill {
  status: SkillStatusType;
}

export type IEditSkill = Omit<
  ISkill,
  'id' | 'username' | 'avatarUsername' | 'createdAt' | 'category'
> & { category: CategoryType };

export type CategoryType = (typeof categories)[number];
export type CategoryViewType = (typeof categoriesView)[number];

export type ContactType = 'site' | 'telegram' | 'vk' | 'wechat';

export type SkillHistorySearchType = SkillStatusType | 'ALL';
export type SkillStatusType = keyof typeof skillStatus;
