import style from './ProfileEdit.module.scss';
import logoIMG from '../../assets/img/logo.png';
import { formatTimestamp } from '../../utils/formatTimestamp';
import Block from '../../ui/Block/Block';
import { useAppSelector } from '../../hooks/useAppDispatch';
import A from '../../ui/A/A';
import IconButton from '../../ui/IconButton/IconButton';
import SettingsSVG from '../../ui/svg/SettingsSVG';
import { useState } from 'react';
import { SettingsModal } from '../SettingsModal/SettingsModal';
import classNames from 'classnames';

interface ProfileEditProps {
  className?: string;
}

export const ProfileEdit: React.FC<ProfileEditProps> = ({ className }) => {
  const profile = useAppSelector((state) => state.profile.profile);
  const [isOpenSettings, setOpenSettings] = useState(false);

  return (
    <Block className={classNames(style.profile, className)}>
      {isOpenSettings && <SettingsModal onClose={() => setOpenSettings(false)} />}

      {profile && (
        <div className={style.profile__header}>
          <IconButton
            icon={<SettingsSVG size={30} />}
            onClick={() => setOpenSettings(true)}
            title="Настройки"
          />
        </div>
      )}

      {!profile && (
        <div className={style.profile__auth}>
          <p>Вы не вошли в профиль.</p>
          <A to="/login">Сделайте это!</A>
        </div>
      )}

      {profile && (
        <div className={style.profile__fields}>
          <img className={style.profile__avatar} src={logoIMG} alt="Изображение профиля" />
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
        </div>
      )}
    </Block>
  );
};

export default ProfileEdit;
