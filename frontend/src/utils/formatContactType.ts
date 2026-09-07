import type { ContactType } from '../types/skill';

export const formatContactType = (text: ContactType) => {
  switch (text) {
    case 'site':
      return 'на сайте';
    case 'vk':
      return 'вконтакте';
    default:
      return text;
  }
};
