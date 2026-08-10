import { Link } from 'react-router';

import style from './AvatarLink.module.scss';
import userIMG from './../../../public/img/user.png';

interface AvatarLinkProps {
  profileAvatar: string | null;
  profileId: string;
  username?: string;
}

const AvatarLink: React.FC<AvatarLinkProps> = ({ profileAvatar, profileId, username }) => {
  return (
    <Link className={style.avatar} to={`/profile/${profileId}`}>
      <img className={style.avatar__image} src={profileAvatar ? profileAvatar : userIMG} />
      {username && <p className={style.avatar__username}>{username}</p>}
    </Link>
  );
};

export default AvatarLink;
