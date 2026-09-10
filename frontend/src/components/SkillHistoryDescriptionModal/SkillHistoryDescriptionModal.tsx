import type { ISkillHistory } from '../../types/skill';
import AvatarLink from '../../ui/AvatarLink/AvatarLink';
import Modal from '../../ui/Modal/Modal';
import style from './SkillHistoryDescriptionModal.module.scss';
import logoIMG from '../../assets/img/logo.png';
import ButtonSecondary from '../../ui/ButtonSecondary/ButtonSecondary';
import { formatTimestamp } from '../../utils/formatTimestamp';
import Badge from '../../ui/Badge/Badge';
import { formatContactType } from '../../utils/formatContactType';
import classNames from 'classnames';
import { formatSkillStatusType } from '../../utils/formatSkillStatusType';

interface SkillHistoryDescriptionModalProps {
  onClose: () => void;
  skill: ISkillHistory;
}

export const SkillHistoryDescriptionModal: React.FC<SkillHistoryDescriptionModalProps> = ({
  onClose,
  skill,
}) => {
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
            {skill.contactType !== 'site' && (
              <Badge
                text={formatContactType(skill.contactType)}
                className={classNames(
                  style.skill__content__social__badge,
                  skill.contactType === 'telegram' && style.badge_tg,
                  skill.contactType === 'vk' && style.badge_vk,
                  skill.contactType === 'wechat' && style.badge_wc
                )}
              />
            )}
            <p className={style.skill__subtitle}>Контактная информация</p>
            <p>
              {skill.contactType === 'site' ? 'На сайте' : skill.contactValue || 'Нет информации'}
            </p>
          </div>

          <div className={style.skill__created}>
            <p className={style.created}>Опубликовано {formatTimestamp(skill.createdAt)}</p>
            <Badge
              className={classNames(skill.status === 'CLOSED' && style.status_active)}
              text={formatSkillStatusType(skill.status)}
            />
          </div>
        </div>

        <div className={style.skill__controls}>
          <ButtonSecondary onClick={onClose}>Отмена</ButtonSecondary>
        </div>
      </div>
    </Modal>
  );
};
