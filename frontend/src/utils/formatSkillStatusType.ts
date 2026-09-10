import type { SkillHistorySearchType, SkillStatusType } from '../types/skill';

export const formatSkillStatusType = (text: SkillStatusType) => {
  switch (text) {
    case 'ACTIVE':
      return 'Активный';
    case 'CLOSED':
      return 'Завершенный';
    default:
      return text;
  }
};

export const formatSkillHistorySearchType = (text: SkillHistorySearchType) => {
  switch (text) {
    case 'ACTIVE':
      return 'Активные';
    case 'CLOSED':
      return 'Завершенные';
    case 'ALL':
      return 'Все';
    default:
      return text;
  }
};
