import { Link } from 'react-router';
import classNames from 'classnames';

import style from './AvatarLink.module.scss';
import { getAvatarColor, getAvatarLetter } from '../../utils/getAvatarColor';

interface AvatarLinkProps {
  profileAvatar: string | null;
  profileId: string;
  username?: string;
  className?: string;
}

const AvatarLink: React.FC<AvatarLinkProps> = ({
  profileAvatar,
  profileId,
  username,
  className,
}) => {
  const showLetter = !profileAvatar;

  return (
    <Link className={classNames(style.avatar, className)} to={`/profile/view/${profileId}`}>
      {showLetter ? (
        <div
          className={style.avatar__letter}
          style={{ backgroundColor: getAvatarColor(username ?? '') }}
          aria-hidden="true"
        >
          {getAvatarLetter(username)}
        </div>
      ) : (
        <img className={style.avatar__image} src={profileAvatar} alt={username ?? 'Аватар'} />
      )}

      {username && <p className={style.avatar__username}>{username}</p>}
    </Link>
  );
};

export default AvatarLink;
