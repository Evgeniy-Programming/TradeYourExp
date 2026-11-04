import type { TFunction } from 'i18next';
import { categoryCodes } from '../constants/categories';

// Переводит русское название категории в локализованный текст
// 'Все категории' обрабатывается отдельно
export const formatCategory = (category: string, t: TFunction): string => {
  if (category === 'Все категории') return t('categories.all');

  const code = categoryCodes[category as keyof typeof categoryCodes];
  return code ? t(`categories.${code}`) : category;
};
