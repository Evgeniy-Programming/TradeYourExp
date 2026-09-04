import Modal from '../../ui/Modal/Modal';
import style from './SkillDescriptionModal.module.scss';

interface SkillDescriptionModalProps {
  onClose: () => void;
}

export const SkillDescriptionModal: React.FC<SkillDescriptionModalProps> = ({ onClose }) => {
  return (
    <Modal className={style.modal} onClick={onClose}>
      <h2>Описание обмена</h2>
    </Modal>
  );
};
