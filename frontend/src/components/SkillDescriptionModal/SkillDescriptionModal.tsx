import type { ISkill } from '../../types/skill';
import AvatarLink from '../../ui/AvatarLink/AvatarLink';
import Modal from '../../ui/Modal/Modal';
import style from './style.module.scss';
import Button from '../../ui/Button/Button';
import ButtonSecondary from '../../ui/ButtonSecondary/ButtonSecondary';
import { formatTimestamp } from '../../utils/formatTimestamp';
import Badge from '../../ui/Badge/Badge';
import { formatContactType } from '../../utils/formatContactType';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { formatCategory } from '../../utils/formatCategory';

interface SkillDescriptionModalProps {
  onClose: () => void;
  onAccept: () => void;
  skill: ISkill;
}

export const SkillDescriptionModal: React.FC<SkillDescriptionModalProps> = ({
  onClose,
  onAccept,
  skill,
}) => {
  const { t } = useTranslation();

  const acceptSkill = () => {
    onAccept();
    onClose();
  };

  return (
    <Modal className={style.modal} onClick={onClose}>
      <h2>{t('skillDescription.title')}</h2>

      <div className={style.skill}>
        <div className={style.skill__header}>
          <AvatarLink
            profileAvatar={skill.avatarUsername}
            profileId={skill.username}
            username={skill.username}
          />
          <div className={style.skill__header__category}>{formatCategory(skill.category, t)}</div>
        </div>

        <div className={style.skill__content}>
          <div className={style.skill__content__skill}>
            <b>{skill.skill}</b>
            <p>{t('preview.exchangeFor')}</p>
            <b>{skill.exchange}</b>
          </div>

          <div className={style.skill__content__desc}>
            <p className={style.skill__subtitle}>{t('skill.description')}</p>
            <p className={style.skill__content__desc__content}>
              {skill.description || t('common.noInfo')}
            </p>
          </div>

          <div className={style.skill__content__social}>
            {skill.contactType !== 'site' && (
              <Badge
                text={formatContactType(skill.contactType, t)}
                className={classNames(
                  style.skill__content__social__badge,
                  skill.contactType === 'telegram' && style.badge_tg,
                  skill.contactType === 'vk' && style.badge_vk,
                  skill.contactType === 'wechat' && style.badge_wc
                )}
              />
            )}
            <p className={style.skill__subtitle}>{t('skill.contact')}</p>
            <p>
              {skill.contactType === 'site'
                ? t('creator.contactSite')
                : skill.contactValue || t('common.noInfo')}
            </p>
          </div>

          <p className={style.created}>
            {t('skill.published')} {formatTimestamp(skill.createdAt, t)}
          </p>
        </div>

        <div className={style.skill__controls}>
          <ButtonSecondary onClick={onClose}>{t('common.cancel')}</ButtonSecondary>
          <Button onClick={acceptSkill}>{t('skill.acceptExchange')}</Button>
        </div>
      </div>
    </Modal>
  );
};
