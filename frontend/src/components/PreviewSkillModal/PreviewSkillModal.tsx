import AvatarLink from '../../ui/AvatarLink/AvatarLink';
import Modal from '../../ui/Modal/Modal';
import style from './style.module.scss';
import logoIMG from '../../assets/img/logo.png';
import Button from '../../ui/Button/Button';
import ButtonSecondary from '../../ui/ButtonSecondary/ButtonSecondary';
import { formatTimestamp } from '../../utils/formatTimestamp';
import { useAppSelector } from '../../hooks/useAppDispatch';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import Badge from '../../ui/Badge/Badge';
import classNames from 'classnames';
import { formatContactType } from '../../utils/formatContactType';
import { useTranslation } from 'react-i18next';
import { formatCategory } from '../../utils/formatCategory';

interface PreviewSkillModalProps {
  onClose: () => void;
  sendSkill: () => void;
}

export const PreviewSkillModal: React.FC<PreviewSkillModalProps> = ({ onClose, sendSkill }) => {
  const { t } = useTranslation();
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
      <h2>{t('preview.title')}</h2>

      {!skill && <p>{t('common.loading')}</p>}

      {skill && (
        <div className={style.skill}>
          <div className={style.skill__header}>
            <AvatarLink
              profileAvatar={logoIMG}
              profileId={profile.username}
              username={profile.username}
            />
            <div className={style.skill__header__category}>{formatCategory(skill.category, t)}</div>
          </div>

          <div className={style.skill__content}>
            <div className={style.skill__content__skill}>
              <b>{skill.skill || t('common.noInfo')}</b>
              <p>{t('preview.exchangeFor')}</p>
              <b>{skill.exchange || t('common.noInfo')}</b>
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
              {t('skill.published')} {formatTimestamp(currentTime, t)}
            </p>
          </div>

          <div className={style.skill__controls}>
            <ButtonSecondary onClick={onClose}>{t('common.cancel')}</ButtonSecondary>
            <Button onClick={handleSendSkill}>{t('creator.publish')}</Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
