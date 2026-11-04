import style from './style.module.scss';
import logoIMG from '../../assets/img/logo.png';
import AvatarLink from '../../ui/AvatarLink/AvatarLink';
import Button from '../../ui/Button/Button';
import { useState } from 'react';
import { SkillDescriptionModal } from '../SkillDescriptionModal/SkillDescriptionModal';
import { useAppSelector } from '../../hooks/useAppDispatch';
import { ToAuthModal } from '../ToAuthModal/ToAuthModal';
import type { ISkill } from '../../types/skill';
import { SkillOfferModal } from '../SkillOfferModal/SkillOfferModal';
import Badge from '../../ui/Badge/Badge';
import { useTranslation } from 'react-i18next';
import { formatCategory } from '../../utils/formatCategory';

interface SkillProps {
  skill: ISkill;
}

export const Skill: React.FC<SkillProps> = ({ skill }) => {
  const { t } = useTranslation();
  const [isOpenDescModal, setOpenDescModal] = useState(false);
  const [isOpenOfferModal, setOpenOfferModal] = useState(false);
  const [isOpenAuthModal, setOpenAuthModal] = useState(false);
  const profile = useAppSelector((state) => state.profile.profile);

  const handleOpenDesc = () => {
    if (profile) {
      setOpenDescModal(true);
    } else {
      setOpenAuthModal(true);
    }
  };

  const acceptSkill = (addition: string) => {
    console.log(addition);
  };

  return (
    <>
      {isOpenDescModal && (
        <SkillDescriptionModal
          skill={skill}
          onClose={() => setOpenDescModal(false)}
          onAccept={() => setOpenOfferModal(true)}
        />
      )}
      {isOpenOfferModal && (
        <SkillOfferModal onClose={() => setOpenOfferModal(false)} onAccept={acceptSkill} />
      )}
      {isOpenAuthModal && <ToAuthModal onClose={() => setOpenAuthModal(false)} />}
      <div className={style.skill}>
        <div className={style.skill__category}>
          <Badge text={formatCategory(skill.category, t)} />
        </div>
        <div className={style.skill__content}>
          <div className={style.skill__content__info}>
            <div className={style.skill__content__avatar}>
              <AvatarLink
                profileAvatar={logoIMG}
                username={skill.username}
                profileId={skill.username}
              />
            </div>
            <div className={style.skill__contact}>
              <Button isMini onClick={handleOpenDesc}>
                {t('skill.details')}
              </Button>
            </div>
          </div>

          <div className={style.skill__text}>
            <b>{skill.skill}</b>
            <p>{t('skill.on')}</p>
            <b>{skill.exchange}</b>
          </div>

          <div></div>
        </div>
      </div>
    </>
  );
};
