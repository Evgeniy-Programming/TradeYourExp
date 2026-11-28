import { Link } from 'react-router';
import classNames from 'classnames';

import style from './style.module.scss';
import Avatar from '../../ui/Avatar/Avatar';

interface UserAvatarLinkProps {
  profileAvatar?: string | null;
  profileId: string;
  username?: string | null;
  profileRaiting?: number | null;
  size?: number;
  className?: string;
}

const UserAvatarLink: React.FC<UserAvatarLinkProps> = ({
  profileAvatar,
  profileId,
  username,
  profileRaiting,
  size = 32,
  className,
}) => {
  const hasRating = typeof profileRaiting === 'number' && !Number.isNaN(profileRaiting);

  return (
    <Link className={classNames(style.userAvatar, className)} to={`/profile/view/${profileId}`}>
      <Avatar src={profileAvatar} username={username} size={size} />
      {(username || hasRating) && (
        <p className={style.userAvatar__username}>
          {username}
          {hasRating && (
            <span className={style.userAvatar__rating}>
              {profileRaiting.toFixed(2)} <span className={style.userAvatar__star}>★</span>
            </span>
          )}
        </p>
      )}
    </Link>
  );
};

export default UserAvatarLink;
