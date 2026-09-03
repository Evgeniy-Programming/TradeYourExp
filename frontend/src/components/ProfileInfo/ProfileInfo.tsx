import style from './ProfileInfo.module.scss';
import logoIMG from '../../assets/img/logo.png';
import { formatTimestamp } from '../../utils/formatTimestamp';
import Block from '../../ui/Block/Block';
import { useAppSelector } from '../../hooks/useAppDispatch';
import A from '../../ui/A/A';

export const ProfileInfo = () => {
  const profile = useAppSelector((state) => state.profile.profile);

  return (
    <Block className={style.profile}>
      {!profile && (
        <div className={style.profile__auth}>
          <p>Вы не вошли в профиль.</p>
          <A to="/login">Сделайте это!</A>
        </div>
      )}
      {profile && (
        <>
          <img src={logoIMG} alt="Изображение профиля" />
          <div className={style.profile__field}>
            <p>Никнейм</p>
            <b>{profile.username}</b>
          </div>
          <div className={style.profile__field}>
            <p>Email</p>
            <b>{profile.email}</b>
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
        </>
      )}
    </Block>
  );
};
