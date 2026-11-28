import Block from '../../ui/Block/Block';
import Avatar from '../../ui/Avatar/Avatar';
import { formatTimestamp } from '../../utils/formatTimestamp';
import type { IProfile } from '../../types/profile';
import style from './style.module.scss';
import { useTranslation } from 'react-i18next';

interface ProfileViewInfoProps {
  profile: IProfile;
  className?: string;
}

export const ProfileViewInfo: React.FC<ProfileViewInfoProps> = ({ profile, className }) => {
  const { t } = useTranslation();

  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ');

  return (
    <Block className={[style.profile, className].filter(Boolean).join(' ')}>
      <div className={style.profile__avatar}>
        <Avatar src={null} username={profile.username} size={96} />
      </div>

      <h2 className={style.profile__username}>{profile.username}</h2>

      {fullName && (
        <div className={style.profile__field}>
          <span className={style.profile__label}>{t('profile.name')}</span>
          <p className={style.profile__value}>{fullName}</p>
        </div>
      )}

      {profile.link && (
        <div className={style.profile__field}>
          <span className={style.profile__label}>{t('profile.link')}</span>
          <a
            className={style.profile__link}
            href={profile.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {profile.link}
          </a>
        </div>
      )}

      <div className={style.profile__field}>
        <span className={style.profile__label}>{t('profile.registered')}</span>
        <p className={style.profile__value}>{formatTimestamp(profile.createdAt, t)}</p>
      </div>
    </Block>
  );
};

export default ProfileViewInfo;
