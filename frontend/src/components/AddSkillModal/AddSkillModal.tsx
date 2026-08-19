import { useState } from 'react';
import Button from '../../ui/Button/Button';
import ButtonSecondary from '../../ui/ButtonSecondary/ButtonSecondary';
import Input from '../../ui/Input/Input';
import Modal from '../../ui/Modal/Modal';
import style from './style.module.css';
import IconButton from '../../ui/IconButton/IconButton';
import ArrowSVG from '../../ui/svg/ArrowSVG';
import ModalElement from '../../ui/ModalElement/ModalElement';
import { Skill } from '../Skill/Skill';

interface AddSkillModalProps {
  onClose: () => void;
  yourSkill: string;
  anotherSkill: string;
}

type ContactType = 'site' | 'telegram' | 'vk' | 'wechat';

export const AddSkillModal: React.FC<AddSkillModalProps> = ({
  onClose,
  yourSkill,
  anotherSkill,
}) => {
  const [isOpenDescModal, setOpenDescModal] = useState(false);
  const [isOpenPreviewModal, setOpenPreviewModal] = useState(false);

  const [isOpenContact, setOpenContact] = useState(false);
  const handleChangeContactType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = e.target.value as ContactType;
    setContactType(selectedType);

    if (selectedType === 'site') {
      setOpenContact(false);
      setContactValue(null);
    } else {
      setOpenContact(true);
    }
  };

  const [description, setDescription] = useState('');
  const [contactType, setContactType] = useState<ContactType>('site');
  const [contactValue, setContactValue] = useState<string | null>(null);

  const handleSendForm = () => {
    onClose();
  };

  return (
    <Modal onClick={onClose} className={style.modal}>
      <div className={style.form}>
        <h2>Дополнительная информация</h2>

        <div className={style.form__field}>
          <label htmlFor="addSkillFieldDesc">Полная информация</label>
          <div className={style.form__field__textarea}>
            <IconButton
              icon={<ArrowSVG color="#000000" rotate={45} />}
              onClick={() => setOpenDescModal(true)}
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              id="addSkillFieldDesc"
              placeholder="Расскажите подробнее о вашем предложении..."
            ></textarea>
            {isOpenDescModal && (
              <ModalElement onClick={() => setOpenDescModal(false)}>
                <textarea
                  className={style.form__field__textarea_max}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Расскажите подробнее о вашем предложении..."
                ></textarea>
              </ModalElement>
            )}
          </div>
        </div>

        <div className={style.form__field}>
          <label htmlFor="addSkillFieldContact">Способ связи</label>
          <select value={contactType} id="addSkillFieldContact" onChange={handleChangeContactType}>
            <option value="site">На сайте</option>
            <option value="telegram">Телеграм</option>
            <option value="vk">Вконтакте</option>
            <option value="wechat">WeChat</option>
          </select>
        </div>

        {isOpenContact && (
          <div className={style.form__field}>
            <label htmlFor="addSkillFieldContactValue">Ваш контакт</label>
            <Input
              value={contactValue || ''}
              onChange={(e) => setContactValue(e.target.value)}
              id="addSkillFieldContactValue"
              placeholder="Введите ваш контакт"
            />
          </div>
        )}

        <div className={style.form__controls}>
          <ButtonSecondary onClick={() => setOpenPreviewModal(true)}>Посмотреть</ButtonSecondary>
          <Button type="button" onClick={handleSendForm}>
            Опубликовать
          </Button>
        </div>
      </div>

      {isOpenPreviewModal && (
        <Modal onClick={() => setOpenPreviewModal(false)} className={style.previewModal}>
          <h2>Как будет выглядеть ваш запрос</h2>

          <Skill
            author="Test"
            authorSkill="test"
            requestSkill="test"
            contactType={contactType}
            username={contactValue}
          />

          <Button onClick={() => setOpenPreviewModal(false)}>Закрыть</Button>
        </Modal>
      )}
    </Modal>
  );
};
