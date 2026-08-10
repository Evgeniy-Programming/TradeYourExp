import style from './Avatar.module.scss';
import userIMG from './../../../public/img/user.png';

interface AvatarProps {
  profileAvatar: string | null;
  username?: string;
}

const Avatar: React.FC<AvatarProps> = ({ profileAvatar, username }) => {
  return (
    <div className={style.avatar}>
      <img className={style.avatar__image} src={profileAvatar ? profileAvatar : userIMG} />
      {username && <p className={style.avatar__username}>{username}</p>}
    </div>
  );
};

export default Avatar;
