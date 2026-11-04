import style from './style.module.scss';
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
import { useTranslation } from 'react-i18next';

interface ProfileEditProps {
  className?: string;
}

export const ProfileEdit: React.FC<ProfileEditProps> = ({ className }) => {
  const { t } = useTranslation();
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
            title={t('settings.title')}
          />
        </div>
      )}

      {!profile && (
        <div className={style.profile__auth}>
          <p>{t('profileEdit.notLoggedIn')}</p>
          <A to="/login">{t('profileEdit.doIt')}</A>
        </div>
      )}

      {profile && (
        <div className={style.profile__fields}>
          <img className={style.profile__avatar} src={logoIMG} alt={t('profileEdit.avatarAlt')} />
          <div className={style.profile__field}>
            <p>{t('auth.usernameLabel')}</p>
            <b>{profile.username}</b>
          </div>
          <div className={style.profile__field}>
            <p>{t('auth.emailLabel')}</p>
            <b>{profile.email}</b>
          </div>
          {profile.lastName && (
            <div className={style.profile__field}>
              <p>{t('auth.lastNameLabel')}</p>
              <b>{profile.lastName}</b>
            </div>
          )}
          {profile.firstName && (
            <div className={style.profile__field}>
              <p>{t('auth.firstNameLabel')}</p>
              <b>{profile.firstName}</b>
            </div>
          )}
          <div className={style.profile__field}>
            <p>{t('profileEdit.registered')}</p>
            <b>{formatTimestamp(profile.createdAt, t)}</b>
          </div>
        </div>
      )}
    </Block>
  );
};

export default ProfileEdit;
