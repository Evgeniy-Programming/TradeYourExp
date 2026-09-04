import { Link } from 'react-router';

import style from './AvatarLink.module.scss';
import classNames from 'classnames';

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
  return (
    <Link className={classNames(style.avatar, className)} to={`/profile/view/${profileId}`}>
      <img className={style.avatar__image} src={profileAvatar ? profileAvatar : userIMG} />
      {username && <p className={style.avatar__username}>{username}</p>}
    </Link>
  );
};

export default AvatarLink;
