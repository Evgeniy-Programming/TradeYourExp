import { useState } from 'react';
import InputPassword from '../../ui/InputPassword/InputPassword';
import Modal from '../../ui/Modal/Modal';
import style from './style.module.scss';
import Button from '../../ui/Button/Button';
import ButtonSecondary from '../../ui/ButtonSecondary/ButtonSecondary';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setErrorWithTimeout } from '../../store/slices/appSlice';
import { authAPI } from '../../api/auth';
import { useTranslation } from 'react-i18next';

interface ChangePasswordModalProps {
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const [fieldCurrentPassword, setFieldCurrentPassword] = useState('');
  const [fieldNewPassword, setFieldNewPassword] = useState('');
  const [fieldRepeatPassword, setFieldRepeatPassword] = useState('');

  const dispatch = useAppDispatch();

  const editPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (fieldNewPassword !== fieldRepeatPassword) {
      dispatch(setErrorWithTimeout(new Error(t('changePassword.passwordsMismatch'))));
      return;
    }

    try {
      await authAPI.changePassword({
        currentPassword: fieldCurrentPassword,
        newPassword: fieldNewPassword,
      });
      onClose();
    } catch (error) {
      dispatch(setErrorWithTimeout(error));
    }
  };

  return (
    <Modal className={style.modal} onClick={onClose}>
      <h2>{t('changePassword.title')}</h2>

      <form className={style.form} onSubmit={(e) => editPassword(e)}>
        <div className={style.form__field}>
          <label>{t('changePassword.oldPassword')}</label>
          <InputPassword
            value={fieldCurrentPassword}
            onChange={(e) => setFieldCurrentPassword(e.target.value)}
          />
        </div>
        <div className={style.form__field}>
          <label>{t('changePassword.newPassword')}</label>
          <InputPassword
            value={fieldNewPassword}
            onChange={(e) => setFieldNewPassword(e.target.value)}
          />
        </div>
        <div className={style.form__field}>
          <label>{t('changePassword.repeatPassword')}</label>
          <InputPassword
            value={fieldRepeatPassword}
            onChange={(e) => setFieldRepeatPassword(e.target.value)}
          />
        </div>

        <Button type="submit">{t('common.save')}</Button>
        <ButtonSecondary onClick={onClose}>{t('common.cancel')}</ButtonSecondary>
      </form>
    </Modal>
  );
};
