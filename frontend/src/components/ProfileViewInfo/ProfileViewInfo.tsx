import style from './ProfileViewInfo.module.scss';
import logoIMG from '../../assets/img/logo.png';
import { formatTimestamp } from '../../utils/formatTimestamp';
import Block from '../../ui/Block/Block';
import { useAppSelector } from '../../hooks/useAppDispatch';
import classNames from 'classnames';
import { StarRating } from '../StarRaiting/StarRaiting';

interface ProfileViewInfoProps {
  className?: string;
}

export const ProfileViewInfo: React.FC<ProfileViewInfoProps> = ({ className }) => {
  const profile = useAppSelector((state) => state.profile.profileView);

  return (
    <Block className={classNames(style.profile, className)}>
      {!profile && (
        <div className={style.profile__auth}>
          <p>Загрузка профиля...</p>
        </div>
      )}
      {profile && (
        <div className={style.profile__fields}>
          <img src={logoIMG} alt="Изображение профиля" />
          <div className={classNames(style.profile__field, style.profile__stars)}>
            <StarRating rating={profile.stats.raiting} />
            <b>{profile.stats.raiting} / 5</b>
          </div>
          <div className={style.profile__field}>
            <p>Никнейм</p>
            <b>{profile.username}</b>
          </div>
          {profile.lastName && (
            <div className={style.profile__field}>
              <p>Фамилия</p>
              <b>{profile.lastName}</b>
            </div>
          )}
          {profile.firstName && (
            <div className={style.profile__field}>
              <p>Имя</p>
              <b>{profile.firstName}</b>
            </div>
          )}
          <div className={style.profile__field}>
            <p>Зарегистрирован</p>
            <b>{formatTimestamp(profile.createdAt)}</b>
          </div>
        </div>
      )}
    </Block>
  );
};
