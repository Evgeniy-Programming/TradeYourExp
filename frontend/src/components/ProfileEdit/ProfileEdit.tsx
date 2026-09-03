import style from './ProfileEdit.module.scss';
import logoIMG from '../../assets/img/logo.png';
import { formatTimestamp } from '../../utils/formatTimestamp';
import Block from '../../ui/Block/Block';
import { useAppSelector } from '../../hooks/useAppDispatch';
import A from '../../ui/A/A';
import Input from '../../ui/Input/Input';
import Button from '../../ui/Button/Button';
import { useState } from 'react';
import ButtonSecondary from '../../ui/ButtonSecondary/ButtonSecondary';
import AvatarEdit from '../../ui/AvatarEdit/AvatarEdit';
import { ChangePasswordModal } from '../ChangePasswordModal/ChangePasswordModal';

export const ProfileEdit = () => {
  const profile = useAppSelector((state) => state.profile.profile);

  const [isEditProfile, setEditProfile] = useState(false);
  const [isOpenPasswordModal, setOpenPasswordModal] = useState(false);

  const [fieldUsername, setFieldUsername] = useState(profile?.username || '');
  const [fieldEmail, setFieldEmail] = useState(profile?.email || '');
  const [fieldFirstName, setFieldFirstName] = useState(profile?.firstName || '');
  const [fieldLastName, setFieldLastName] = useState(profile?.lastName || '');
  const [fieldLink, setFieldLink] = useState(profile?.link || '');

  const editProfile = () => {
    setEditProfile((prev) => !prev);
  };

  return (
    <Block className={style.profile}>
      {isOpenPasswordModal && (
        <ChangePasswordModal onClose={() => setOpenPasswordModal(false)} />
      )}
      {!profile && (
        <div className={style.profile__auth}>
          <p>Вы не вошли в профиль.</p>
          <A to="/login">Сделайте это!</A>
        </div>
      )}
      {profile && (
        <div className={style.profile__fields}>
          <AvatarEdit className={style.profile__field__avatar} profileAvatar={logoIMG} />
          <div className={style.profile__field}>
            <p>Никнейм</p>
            <Input
              value={fieldUsername}
              onChange={(e) => setFieldUsername(e.target.value)}
              disabled={!isEditProfile}
            />
          </div>
          <div className={style.profile__field}>
            <p>Email</p>
            <Input
              type="email"
              value={fieldEmail}
              onChange={(e) => setFieldEmail(e.target.value)}
              disabled={!isEditProfile}
            />
          </div>
          <div className={style.profile__field}>
            <p>Фамилия</p>
            <Input
              placeholder="Не обязательно"
              value={fieldLastName}
              onChange={(e) => setFieldLastName(e.target.value)}
              disabled={!isEditProfile}
            />
          </div>
          <div className={style.profile__field}>
            <p>Имя</p>
            <Input
              placeholder="Не обязательно"
              value={fieldFirstName}
              onChange={(e) => setFieldFirstName(e.target.value)}
              disabled={!isEditProfile}
            />
          </div>
          <div className={style.profile__field}>
            <p>Соц. сеть</p>
            <Input
              placeholder="Не обязательно"
              value={fieldLink}
              onChange={(e) => setFieldLink(e.target.value)}
              disabled={!isEditProfile}
            />
          </div>
          <div className={style.profile__field}>
            <p>Зарегистрирован</p>
            <b>{formatTimestamp(profile.createdAt)}</b>
          </div>
          <div className={style.profile__buttons}>
            <Button onClick={() => editProfile()}>
              {isEditProfile ? 'Сохранить' : 'Редактировать'}
            </Button>
            <ButtonSecondary onClick={() => setOpenPasswordModal(true)}>
              Изменить пароль
            </ButtonSecondary>
            {isEditProfile && (
              <ButtonSecondary onClick={() => setEditProfile(false)}>Отменить</ButtonSecondary>
            )}
          </div>
        </div>
      )}
    </Block>
  );
};
