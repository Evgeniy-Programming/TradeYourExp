import { useState } from 'react';
import InputPassword from '../../ui/InputPassword/InputPassword';
import Modal from '../../ui/Modal/Modal';
import style from './ChangePasswordModal.module.scss';
import Button from '../../ui/Button/Button';
import ButtonSecondary from '../../ui/ButtonSecondary/ButtonSecondary';

interface ChangePasswordModalProps {
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ onClose }) => {
  const [fieldCurrentPassword, setFieldCurrentPassword] = useState('');
  const [fieldNewPassword, setFieldNewPassword] = useState('');
  const [fieldRepeatPassword, setFieldRepeatPassword] = useState('');

  const editPassword = () => {
    onClose();
  };

  return (
    <Modal className={style.modal} onClick={onClose}>
      <h2>Редактирование пароля</h2>

      <form className={style.form}>
        <div className={style.form__field}>
          <label>Старый пароль</label>
          <InputPassword value={fieldCurrentPassword} onChange={(e) => setFieldCurrentPassword(e.target.value)} />
        </div>
        <div className={style.form__field}>
          <label>Новый пароль</label>
          <InputPassword value={fieldNewPassword} onChange={(e) => setFieldNewPassword(e.target.value)} />
        </div>
        <div className={style.form__field}>
          <label>Повтор пароля</label>
          <InputPassword value={fieldRepeatPassword} onChange={(e) => setFieldRepeatPassword(e.target.value)} />
        </div>

        <Button onClick={editPassword}>Сохранить</Button>
        <ButtonSecondary onClick={onClose}>Отмена</ButtonSecondary>
      </form>
    </Modal>
  );
};
