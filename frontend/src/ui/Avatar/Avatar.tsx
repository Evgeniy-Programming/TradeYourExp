import classNames from 'classnames';

import style from './Avatar.module.scss';
import { getAvatarColor, getAvatarLetter } from '../../utils/getAvatarColor';

export interface AvatarProps {
  src?: string | null;
  username?: string | null;
  size?: number;
  className?: string;
  alt?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, username, size = 32, className, alt }) => {
  const showLetter = !src;
  const letter = getAvatarLetter(username);
  const color = getAvatarColor(username ?? '');

  const letterStyle: React.CSSProperties = {
    width: size,
    height: size,
    fontSize: Math.round(size * 0.45),
    backgroundColor: color,
  };

  if (showLetter) {
    return (
      <div
        className={classNames(style.avatar, style.avatar_letter, className)}
        style={letterStyle}
        aria-label={alt ?? username ?? 'Аватар'}
        role="img"
      >
        {letter}
      </div>
    );
  }

  return (
    <img
      className={classNames(style.avatar, className)}
      style={letterStyle}
      src={src}
      alt={alt ?? username ?? 'Аватар'}
    />
  );
};

export default Avatar;
