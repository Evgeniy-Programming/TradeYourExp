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

interface ProfileEditModalProps {
  onClose: () => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ onClose }) => {
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
      <h2>Редактирование профиля</h2>

      <div className={style.fields}>
        <AvatarEdit className={style.fields__avatar} profileAvatar={logoIMG} />

        <div className={style.fields__field}>
          <label htmlFor="edit-username">Никнейм</label>
          <Input
            id="edit-username"
            value={fieldUsername}
            onChange={(e) => setFieldUsername(e.target.value)}
          />
        </div>
        <div className={style.fields__field}>
          <label htmlFor="edit-email">Email</label>
          <Input
            id="edit-email"
            type="email"
            value={fieldEmail}
            onChange={(e) => setFieldEmail(e.target.value)}
          />
        </div>
        <div className={style.fields__field}>
          <label htmlFor="edit-lastName">Фамилия</label>
          <Input
            id="edit-lastName"
            placeholder="Не обязательно"
            value={fieldLastName}
            onChange={(e) => setFieldLastName(e.target.value)}
          />
        </div>
        <div className={style.fields__field}>
          <label htmlFor="edit-firstName">Имя</label>
          <Input
            id="edit-firstName"
            placeholder="Не обязательно"
            value={fieldFirstName}
            onChange={(e) => setFieldFirstName(e.target.value)}
          />
        </div>
        <div className={style.fields__field}>
          <label htmlFor="edit-link">Соц. сеть</label>
          <Input
            id="edit-link"
            type="url"
            placeholder="Не обязательно"
            value={fieldLink}
            onChange={(e) => setFieldLink(e.target.value)}
          />
        </div>

        <div className={style.fields__controls}>
          <Button isMaxWidth onClick={saveProfile}>
            Сохранить
          </Button>
          <ButtonSecondary isMaxWidth onClick={onClose}>
            Отменить
          </ButtonSecondary>
        </div>
      </div>
    </Modal>
  );
};

export default ProfileEditModal;
