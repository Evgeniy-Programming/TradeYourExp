import classNames from 'classnames';
import EditSVG from '../svg/EditSVG';
import style from './AvatarEdit.module.scss';
import userIMG from '@/assets/img/logo.png';
import Button from '../Button/Button';

interface AvatarEditProps {
  profileAvatar: string | null;
  className?: string;
}

const AvatarEdit: React.FC<AvatarEditProps> = ({ profileAvatar, className }) => {
  return (
    <Button className={classNames(style.avatar, className)}>
      <img className={style.avatar__image} src={profileAvatar ? profileAvatar : userIMG} />
      <div className={style.avatar__edit}>
        <EditSVG size={15} />
      </div>
    </Button>
  );
};

export default AvatarEdit;
