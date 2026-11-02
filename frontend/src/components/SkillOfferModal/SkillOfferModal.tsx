import Modal from '../../ui/Modal/Modal';
import style from './style.module.scss';
import Button from '../../ui/Button/Button';
import ButtonSecondary from '../../ui/ButtonSecondary/ButtonSecondary';
import Tooltip from '../../ui/Tooltip/Tooltip';
import { useState } from 'react';

interface SkillOfferModalModalProps {
  onClose: () => void;
  onAccept: (addition: string) => void;
}

export const SkillOfferModal: React.FC<SkillOfferModalModalProps> = ({ onClose, onAccept }) => {
  const acceptSkill = () => {
    onAccept(fieldAddition);
    onClose();
  };

  const [fieldAddition, setFieldAddition] = useState('');

  return (
    <Modal className={style.modal} onClick={onClose}>
      <h2>Уточните предложение</h2>

      <form className={style.form}>
        <div className={style.form__editor}>
          <div className={style.form__field}>
            <Tooltip
              text="Если у вас есть какие-то свои пожелания, уточнения, дополнения и тому подобное, то опишите это сразу"
              className={style.form__field__tooltip}
            />
            <label htmlFor="fieldDesc">Уточнение / дополнение к обмену</label>
            <textarea
              id="fieldDesc"
              placeholder="Не обязательно"
              value={fieldAddition}
              onChange={(e) => setFieldAddition(e.target.value)}
            />
          </div>
        </div>

        <div className={style.skill__controls}>
          <ButtonSecondary onClick={onClose}>Отмена</ButtonSecondary>
          <Button onClick={acceptSkill}>Предложить обмен</Button>
        </div>
      </form>
    </Modal>
  );
};
