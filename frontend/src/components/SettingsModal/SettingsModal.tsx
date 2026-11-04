import { useState } from 'react';
import Modal from '../../ui/Modal/Modal';
import Button from '../../ui/Button/Button';
import ButtonSecondary from '../../ui/ButtonSecondary/ButtonSecondary';
import Switch from '../../ui/Switch/Switch';
import { ProfileEditModal } from '../ProfileEditModal/ProfileEditModal';
import { ChangePasswordModal } from '../ChangePasswordModal/ChangePasswordModal';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { authAPI } from '../../api/auth';
import { clearProfile } from '../../store/slices/profileSlice';
import { setErrorWithTimeout } from '../../store/slices/appSlice';
import { useNavigate } from 'react-router-dom';
import style from './style.module.scss';
import { useTranslation } from 'react-i18next';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isOpenProfileModal, setOpenProfileModal] = useState(false);
  const [isOpenPasswordModal, setOpenPasswordModal] = useState(false);
  const [isDarkTheme, setDarkTheme] = useState(
    () => document.documentElement.dataset.theme === 'dark'
  );

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      dispatch(setErrorWithTimeout(error));
    }
    dispatch(clearProfile());
    navigate('/login');
    onClose();
  };

  const toggleTheme = (next: boolean) => {
    setDarkTheme(next);
    document.documentElement.dataset.theme = next ? 'dark' : 'light';
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <>
      <Modal className={style.modal} onClick={onClose}>
        <h2>{t('settings.title')}</h2>

        <div className={style.actions}>
          <Button isMaxWidth onClick={() => setOpenProfileModal(true)}>
            {t('settings.editProfile')}
          </Button>
          <ButtonSecondary isMaxWidth onClick={() => setOpenPasswordModal(true)}>
            {t('settings.changePassword')}
          </ButtonSecondary>

          <Switch
            checked={isDarkTheme}
            onChange={toggleTheme}
            label={t('settings.darkTheme')}
            className={style.switch}
          />

          <ButtonSecondary isMaxWidth isDanger onClick={logout}>
            {t('settings.logout')}
          </ButtonSecondary>
        </div>
      </Modal>

      {isOpenProfileModal && <ProfileEditModal onClose={() => setOpenProfileModal(false)} />}

      {isOpenPasswordModal && <ChangePasswordModal onClose={() => setOpenPasswordModal(false)} />}
    </>
  );
};

export default SettingsModal;
