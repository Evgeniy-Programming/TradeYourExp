import type { TFunction } from 'i18next';
import type { SkillHistorySearchType, SkillStatusType } from '../types/skill';

export const formatSkillStatusType = (text: SkillStatusType, t: TFunction) => {
  switch (text) {
    case 'ACTIVE':
      return t('skillStatus.ACTIVE');
    case 'CLOSED':
      return t('skillStatus.CLOSED');
    default:
      return text;
  }
};

export const formatSkillHistorySearchType = (text: SkillHistorySearchType, t: TFunction) => {
  switch (text) {
    case 'ACTIVE':
      return t('history.active');
    case 'CLOSED':
      return t('history.closed');
    case 'ALL':
      return t('history.all');
    default:
      return text;
  }
};
