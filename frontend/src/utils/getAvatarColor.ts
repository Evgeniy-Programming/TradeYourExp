const AVATAR_COLORS = [
  '#2e7d52',
  '#1f5c3a',
  '#3f9e6a',
  '#d9534f',
  '#e06460',
  '#c48b3c',
  '#b06a2c',
  '#3a7bbd',
  '#5a6ec4',
  '#7a4fbf',
  '#a34fa3',
  '#4a8a8a',
  '#6b8e4e',
  '#8a5a3c',
  '#5c7a68',
];

/**
 * Детерминированно возвращает цвет для строки (например, username).
 * Один и тот же username всегда даёт один и тот же цвет.
 */
export const getAvatarColor = (seed: string): string => {
  let hash = 0;

  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }

  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

export const getAvatarLetter = (username?: string | null): string => {
  const trimmed = username?.trim();
  if (!trimmed) return '?';
  return trimmed[0].toUpperCase();
};
