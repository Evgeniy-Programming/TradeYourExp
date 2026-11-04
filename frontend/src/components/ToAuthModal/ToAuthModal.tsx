import AButton from '../../ui/AButton/AButton';
import ButtonSecondary from '../../ui/ButtonSecondary/ButtonSecondary';
import Modal from '../../ui/Modal/Modal';
import style from './style.module.scss';
import { useTranslation } from 'react-i18next';

interface ToAuthModalProps {
  onClose: () => void;
}

export const ToAuthModal: React.FC<ToAuthModalProps> = ({ onClose }) => {
  const { t } = useTranslation();

  return (
    <Modal className={style.modal} onClick={onClose}>
      <h2>{t('toAuth.title')}</h2>

      <p>{t('toAuth.description')}</p>

      <div className={style.modal__controls}>
        <AButton to="/login">{t('header.login')}</AButton>
        <ButtonSecondary onClick={onClose}>{t('common.cancel')}</ButtonSecondary>
      </div>
    </Modal>
  );
};
