import classNames from 'classnames';

import style from './style.module.scss';
import Avatar from '../../ui/Avatar/Avatar';

interface UserAvatarProps {
  profileAvatar?: string | null;
  username?: string | null;
  /** Размер круга. По умолчанию 32. */
  size?: number;
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  profileAvatar,
  username,
  size = 32,
  className,
}) => {
  return (
    <div className={classNames(style.userAvatar, className)}>
      <Avatar src={profileAvatar} username={username} size={size} />
      {username && <p className={style.userAvatar__username}>{username}</p>}
    </div>
  );
};

export default UserAvatar;
