import style from './style.module.scss';
import { formatTimestamp } from '../../utils/formatTimestamp';
import Block from '../../ui/Block/Block';
import { useAppSelector } from '../../hooks/useAppDispatch';
import A from '../../ui/A/A';
import AButton from '../../ui/AButton/AButton';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import Avatar from '../../ui/Avatar/Avatar';

interface ProfileInfoProps {
  className?: string;
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({ className }) => {
  const { t } = useTranslation();
  const profile = useAppSelector((state) => state.profile.profile);

  return (
    <Block className={classNames(style.profile, className)}>
      {!profile && (
        <div className={style.profile__auth}>
          <p>{t('profileEdit.notLoggedIn')}</p>
          <A to="/login">{t('profileEdit.doIt')}</A>
        </div>
      )}
      {profile && (
        <div className={style.profile__fields}>
          <Avatar
            className={style.profile__avatar}
            src={profile.avatar}
            size={100}
            username={profile.username}
          />
          {/* <img src={logoIMG} alt={t('profileEdit.avatarAlt')} /> */}
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
          <AButton className={style.profile__button} to="/profile">
            {t('profileInfo.toProfile')}
          </AButton>
        </div>
      )}
    </Block>
  );
};
