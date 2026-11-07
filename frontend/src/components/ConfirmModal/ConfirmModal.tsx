import Modal from '../../ui/Modal/Modal';
import Button from '../../ui/Button/Button';
import ButtonSecondary from '../../ui/ButtonSecondary/ButtonSecondary';
import style from './style.module.scss';
import { useTranslation } from 'react-i18next';

interface ConfirmModalProps {
  text: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  text,
  onConfirm,
  onCancel,
  confirmText = 'confirm.confirm',
  cancelText = 'confirm.cancel',
  isDanger = false,
}) => {
  const { t } = useTranslation();

  return (
    <Modal className={style.modal} onClick={onCancel}>
      <h2>{t('confirm.title')}</h2>

      <p className={style.modal__text}>{t(text)}</p>

      <div className={style.modal__controls}>
        <ButtonSecondary isMaxWidth onClick={onCancel}>
          {t(cancelText)}
        </ButtonSecondary>
        <Button isMaxWidth isDanger={isDanger} onClick={onConfirm}>
          {t(confirmText)}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
