import classNames from 'classnames';
import EditSVG from '../svg/EditSVG';
import style from './AvatarEdit.module.scss';
import Button from '../Button/Button';
import Input from '../Input/Input';
import Avatar from '../Avatar/Avatar';

interface AvatarEditProps {
  profileAvatar: string | null;
  username?: string | null;
  className?: string;
}

const AvatarEdit: React.FC<AvatarEditProps> = ({ profileAvatar, username, className }) => {
  return (
    <Button className={classNames(style.avatar, className)}>
      <Avatar
        src={profileAvatar}
        username={username}
        size={100}
        className={style.avatar__preview}
      />

      <div className={style.avatar__edit}>
        <EditSVG color="#ffffff" />
      </div>

      <label className={style.avatar__label}>
        <Input type="file" className={style.avatar__input} />
      </label>
    </Button>
  );
};

export default AvatarEdit;
