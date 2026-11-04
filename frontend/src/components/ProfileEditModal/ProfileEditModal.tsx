import { useState } from 'react';
import Modal from '../../ui/Modal/Modal';
import Button from '../../ui/Button/Button';
import ButtonSecondary from '../../ui/ButtonSecondary/ButtonSecondary';
import Input from '../../ui/Input/Input';
import AvatarEdit from '../../ui/AvatarEdit/AvatarEdit';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { authAPI } from '../../api/auth';
import { setProfile } from '../../store/slices/profileSlice';
import { setErrorWithTimeout } from '../../store/slices/appSlice';
import type { IEditProfile } from '../../types/profile';
import logoIMG from '../../assets/img/logo.png';
import style from './style.module.scss';
import { useTranslation } from 'react-i18next';

interface ProfileEditModalProps {
  onClose: () => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const profile = useAppSelector((state) => state.profile.profile);
  const dispatch = useAppDispatch();

  const [fieldUsername, setFieldUsername] = useState(profile?.username || '');
  const [fieldEmail, setFieldEmail] = useState(profile?.email || '');
  const [fieldFirstName, setFieldFirstName] = useState(profile?.firstName || '');
  const [fieldLastName, setFieldLastName] = useState(profile?.lastName || '');
  const [fieldLink, setFieldLink] = useState(profile?.link || '');

  const saveProfile = async () => {
    try {
      const updateObject: IEditProfile = {};

      if (fieldUsername) updateObject.username = fieldUsername;
      if (fieldEmail) updateObject.email = fieldEmail;

      updateObject.firstName = fieldFirstName;
      updateObject.lastName = fieldLastName;
      updateObject.link = fieldLink;

      await authAPI.update(updateObject);
      dispatch(setProfile(await authAPI.getMe()));
      onClose();
    } catch (error) {
      dispatch(setErrorWithTimeout(error));
    }
  };

  if (!profile) {
    return null;
  }

  return (
    <Modal className={style.modal} onClick={onClose}>
      <h2>{t('profileEditModal.title')}</h2>

      <div className={style.fields}>
        <AvatarEdit className={style.fields__avatar} profileAvatar={logoIMG} />

        <div className={style.fields__field}>
          <label htmlFor="edit-username">{t('auth.usernameLabel')}</label>
          <Input
            id="edit-username"
            value={fieldUsername}
            onChange={(e) => setFieldUsername(e.target.value)}
          />
        </div>
        <div className={style.fields__field}>
          <label htmlFor="edit-email">{t('auth.emailLabel')}</label>
          <Input
            id="edit-email"
            type="email"
            value={fieldEmail}
            onChange={(e) => setFieldEmail(e.target.value)}
          />
        </div>
        <div className={style.fields__field}>
          <label htmlFor="edit-lastName">{t('auth.lastNameLabel')}</label>
          <Input
            id="edit-lastName"
            placeholder={t('common.optional')}
            value={fieldLastName}
            onChange={(e) => setFieldLastName(e.target.value)}
          />
        </div>
        <div className={style.fields__field}>
          <label htmlFor="edit-firstName">{t('auth.firstNameLabel')}</label>
          <Input
            id="edit-firstName"
            placeholder={t('common.optional')}
            value={fieldFirstName}
            onChange={(e) => setFieldFirstName(e.target.value)}
          />
        </div>
        <div className={style.fields__field}>
          <label htmlFor="edit-link">{t('auth.socialLabel')}</label>
          <Input
            id="edit-link"
            type="url"
            placeholder={t('common.optional')}
            value={fieldLink}
            onChange={(e) => setFieldLink(e.target.value)}
          />
        </div>

        <div className={style.fields__controls}>
          <Button isMaxWidth onClick={saveProfile}>
            {t('common.save')}
          </Button>
          <ButtonSecondary isMaxWidth onClick={onClose}>
            {t('common.cancel')}
          </ButtonSecondary>
        </div>
      </div>
    </Modal>
  );
};

export default ProfileEditModal;
