import style from './style.module.scss';
import logoIMG from '../../assets/img/logo.png';
import AvatarLink from '../../ui/AvatarLink/AvatarLink';
import Button from '../../ui/Button/Button';
import { useState } from 'react';
import { SkillDescriptionModal } from '../SkillDescriptionModal/SkillDescriptionModal';
import { useAppSelector } from '../../hooks/useAppDispatch';
import { ToAuthModal } from '../ToAuthModal/ToAuthModal';
import type { ISkill } from '../../types/skill';

interface SkillPropsType {
  skill: ISkill;
}

export const Skill: React.FC<SkillPropsType> = ({ skill }) => {
  const [isOpenDescModal, setOpenDescModal] = useState(false);
  const [isOpenAuthModal, setOpenAuthModal] = useState(false);
  const profile = useAppSelector((state) => state.profile.profile);

  const handleOpenDesc = () => {
    if (profile) {
      setOpenDescModal(true);
    } else {
      setOpenAuthModal(true);
    }
  };

  return (
    <>
      {isOpenDescModal && (
        <SkillDescriptionModal skill={skill} onClose={() => setOpenDescModal(false)} />
      )}
      {isOpenAuthModal && <ToAuthModal onClose={() => setOpenAuthModal(false)} />}
      <div className={style.skill}>
        <div className={style.skill__content}>
          <div className={style.skill__content__avatar}>
            <AvatarLink
              profileAvatar={logoIMG}
              username={skill.username}
              profileId={skill.username}
            />
          </div>
          <div className={style.skill__contact}>
            <Button isMini onClick={handleOpenDesc}>
              Подробнее
            </Button>
          </div>

          <div className={style.skill__text}>
            <b>{skill.skill}</b>
            <p>на</p>
            <b>{skill.exchange}</b>
          </div>
        </div>
      </div>
    </>
  );
};
