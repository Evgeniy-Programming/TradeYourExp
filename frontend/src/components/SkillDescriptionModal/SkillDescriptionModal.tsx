import type { ISkill } from '../../types/skill';
import AvatarLink from '../../ui/AvatarLink/AvatarLink';
import Modal from '../../ui/Modal/Modal';
import style from './SkillDescriptionModal.module.scss';
import logoIMG from '../../assets/img/logo.png';
import Button from '../../ui/Button/Button';
import ButtonSecondary from '../../ui/ButtonSecondary/ButtonSecondary';
import { formatTimestamp } from '../../utils/formatTimestamp';

interface SkillDescriptionModalProps {
  onClose: () => void;
  skill: ISkill;
}

export const SkillDescriptionModal: React.FC<SkillDescriptionModalProps> = ({ onClose, skill }) => {
  const acceptSkill = () => {
    onClose();
  };

  return (
    <Modal className={style.modal} onClick={onClose}>
      <h2>Описание обмена</h2>

      <div className={style.skill}>
        <div className={style.skill__header}>
          <AvatarLink
            profileAvatar={logoIMG}
            profileId={skill.username}
            username={skill.username}
          />
          <div className={style.skill__header__category}>{skill.category}</div>
        </div>

        <div className={style.skill__content}>
          <div className={style.skill__content__skill}>
            <b>{skill.skill}</b>
            <p>обменять на</p>
            <b>{skill.exchange}</b>
          </div>

          <div className={style.skill__content__desc}>
            <p className={style.skill__subtitle}>Описание</p>
            <p className={style.skill__content__desc__content}>{skill.description}</p>
          </div>

          <div className={style.skill__content__social}>
            <p className={style.skill__subtitle}>Контактная информация</p>
            <p>{skill.media}</p>
          </div>

          <p className={style.created}>Опубликовано {formatTimestamp(skill.createdAt)}</p>
        </div>

        <div className={style.skill__controls}>
          <ButtonSecondary onClick={onClose}>Отмена</ButtonSecondary>
          <Button onClick={acceptSkill}>Принять обмен</Button>
        </div>
      </div>
    </Modal>
  );
};
