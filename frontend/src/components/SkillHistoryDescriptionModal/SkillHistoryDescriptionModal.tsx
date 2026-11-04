import type { ISkillHistory } from '../../types/skill';
import AvatarLink from '../../ui/AvatarLink/AvatarLink';
import Modal from '../../ui/Modal/Modal';
import style from './style.module.scss';
import logoIMG from '../../assets/img/logo.png';
import ButtonSecondary from '../../ui/ButtonSecondary/ButtonSecondary';
import { formatTimestamp } from '../../utils/formatTimestamp';
import Badge from '../../ui/Badge/Badge';
import { formatContactType } from '../../utils/formatContactType';
import classNames from 'classnames';
import { formatSkillStatusType } from '../../utils/formatSkillStatusType';
import { useTranslation } from 'react-i18next';

interface SkillHistoryDescriptionModalProps {
  onClose: () => void;
  skill: ISkillHistory;
}

export const SkillHistoryDescriptionModal: React.FC<SkillHistoryDescriptionModalProps> = ({
  onClose,
  skill,
}) => {
  const { t } = useTranslation();

  return (
    <Modal className={style.modal} onClick={onClose}>
      <h2>{t('skillDescription.title')}</h2>

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

          <div className={style.skill__created}>
            <p className={style.created}>
              {t('skill.published')} {formatTimestamp(skill.createdAt, t)}
            </p>
            <Badge
              className={classNames(skill.status === 'CLOSED' && style.status_active)}
              text={formatSkillStatusType(skill.status, t)}
            />
          </div>
        </div>

        <div className={style.skill__controls}>
          <ButtonSecondary onClick={onClose}>{t('common.cancel')}</ButtonSecondary>
        </div>
      </div>
    </Modal>
  );
};
