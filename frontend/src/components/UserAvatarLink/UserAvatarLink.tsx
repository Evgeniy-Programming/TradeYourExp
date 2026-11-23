import { Link } from 'react-router';
import classNames from 'classnames';

import style from './style.module.scss';
import Avatar from '../../ui/Avatar/Avatar';

interface UserAvatarLinkProps {
  profileAvatar?: string | null;
  profileId: string;
  username?: string | null;
  size?: number;
  className?: string;
}

const UserAvatarLink: React.FC<UserAvatarLinkProps> = ({
  profileAvatar,
  profileId,
  username,
  size = 32,
  className,
}) => {
  return (
    <Link className={classNames(style.userAvatar, className)} to={`/profile/view/${profileId}`}>
      <Avatar src={profileAvatar} username={username} size={size} />
      {username && <p className={style.userAvatar__username}>{username}</p>}
    </Link>
  );
};

export default UserAvatarLink;
