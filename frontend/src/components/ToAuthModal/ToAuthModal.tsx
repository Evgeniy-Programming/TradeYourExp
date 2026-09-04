import AButton from '../../ui/AButton/AButton';
import ButtonSecondary from '../../ui/ButtonSecondary/ButtonSecondary';
import Modal from '../../ui/Modal/Modal';
import style from './ToAuthModal.module.scss';

interface ToAuthModalProps {
  onClose: () => void;
}

export const ToAuthModal: React.FC<ToAuthModalProps> = ({ onClose }) => {
  return (
    <Modal className={style.modal} onClick={onClose}>
      <h2>Требуется вход</h2>

      <p>Чтобы просматривать и публиковать обмены, необходимо войти в профиль.</p>

      <div className={style.modal__controls}>
        <AButton to="/login">Войти</AButton>
        <ButtonSecondary onClick={onClose}>Отмена</ButtonSecondary>
      </div>
    </Modal>
  );
};
