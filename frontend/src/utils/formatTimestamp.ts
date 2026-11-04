import type { TFunction } from 'i18next';

export const formatTimestamp = (timestamp: number | string, t: TFunction): string => {
  const date = new Date(timestamp);

  if (isNaN(date.getTime())) {
    return t('timestamp.unknown');
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return t('timestamp.format', { day, month, year, hours, minutes });
};
