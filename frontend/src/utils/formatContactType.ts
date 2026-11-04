import type { TFunction } from 'i18next';
import type { ContactType } from '../types/skill';

export const formatContactType = (text: ContactType, t: TFunction) => {
  switch (text) {
    case 'site':
      return t('contactType.site');
    case 'vk':
      return t('contactType.vk');
    case 'telegram':
      return t('contactType.telegram');
    case 'wechat':
      return t('contactType.wechat');
    default:
      return text;
  }
};
