import Modal from '../../ui/Modal/Modal';
import style from './style.module.scss';
import Button from '../../ui/Button/Button';
import ButtonSecondary from '../../ui/ButtonSecondary/ButtonSecondary';
import Tooltip from '../../ui/Tooltip/Tooltip';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface SkillOfferModalModalProps {
  onClose: () => void;
  onAccept: (addition: string) => void;
}

export const SkillOfferModal: React.FC<SkillOfferModalModalProps> = ({ onClose, onAccept }) => {
  const { t } = useTranslation();
  const acceptSkill = () => {
    onAccept(fieldAddition);
    onClose();
  };

  const [fieldAddition, setFieldAddition] = useState('');

  return (
    <Modal className={style.modal} onClick={onClose}>
      <h2>{t('skillOffer.title')}</h2>

      <form className={style.form}>
        <div className={style.form__editor}>
          <div className={style.form__field}>
            <Tooltip text={t('skillOffer.tooltip')} className={style.form__field__tooltip} />
            <label htmlFor="fieldDesc">{t('skillOffer.label')}</label>
            <textarea
              id="fieldDesc"
              placeholder={t('common.optional')}
              value={fieldAddition}
              onChange={(e) => setFieldAddition(e.target.value)}
            />
          </div>
        </div>

        <div className={style.skill__controls}>
          <ButtonSecondary onClick={onClose}>{t('common.cancel')}</ButtonSecondary>
          <Button onClick={acceptSkill}>{t('skill.offerExchange')}</Button>
        </div>
      </form>
    </Modal>
  );
};
