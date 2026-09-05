import AvatarLink from '../../ui/AvatarLink/AvatarLink';
import Modal from '../../ui/Modal/Modal';
import style from './PreviewSkillModal.module.scss';
import logoIMG from '../../assets/img/logo.png';
import Button from '../../ui/Button/Button';
import ButtonSecondary from '../../ui/ButtonSecondary/ButtonSecondary';
import { formatTimestamp } from '../../utils/formatTimestamp';
import { useAppSelector } from '../../hooks/useAppDispatch';
import { useNavigate } from 'react-router';
import { useState } from 'react';

interface PreviewSkillModalProps {
  onClose: () => void;
  sendSkill: () => void;
}

export const PreviewSkillModal: React.FC<PreviewSkillModalProps> = ({ onClose, sendSkill }) => {
  const profile = useAppSelector((state) => state.profile.profile);
  const skill = useAppSelector((state) => state.skill.editSkill);
  const navigate = useNavigate();
  const [currentTime] = useState(() => Date.now());

  const handleSendSkill = () => {
    sendSkill();
    onClose();
  };

  if (!profile) {
    navigate('/login');
    return;
  }

  return (
    <Modal className={style.modal} onClick={onClose}>
      <h2>Предварительный просмотр</h2>

      {!skill && <p>Загрузка...</p>}

      {skill && (
        <div className={style.skill}>
          <div className={style.skill__header}>
            <AvatarLink
              profileAvatar={logoIMG}
              profileId={profile.username}
              username={profile.username}
            />
            <div className={style.skill__header__category}>{skill.category}</div>
          </div>

          <div className={style.skill__content}>
            <div className={style.skill__content__skill}>
              <b>{skill.skill || 'Нет информации'}</b>
              <p>обменять на</p>
              <b>{skill.exchange || 'Нет информации'}</b>
            </div>

            <div className={style.skill__content__desc}>
              <p className={style.skill__subtitle}>Описание</p>
              <p className={style.skill__content__desc__content}>
                {skill.description || 'Нет информации'}
              </p>
            </div>

            <div className={style.skill__content__social}>
              <p className={style.skill__subtitle}>Контактная информация</p>
              <p>{skill.media || 'Нет информации'}</p>
            </div>

            <p className={style.created}>Опубликовано {formatTimestamp(currentTime)}</p>
          </div>

          <div className={style.skill__controls}>
            <ButtonSecondary onClick={onClose}>Отмена</ButtonSecondary>
            <Button onClick={handleSendSkill}>Опубликовать</Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
