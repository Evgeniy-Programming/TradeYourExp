import style from './SkillHistory.module.scss';
import logoIMG from '../../assets/img/logo.png';
import AvatarLink from '../../ui/AvatarLink/AvatarLink';
import Button from '../../ui/Button/Button';
import { useState } from 'react';
import { useAppSelector } from '../../hooks/useAppDispatch';
import { ToAuthModal } from '../ToAuthModal/ToAuthModal';
import type { ISkillHistory } from '../../types/skill';
import Badge from '../../ui/Badge/Badge';
import { formatSkillStatusType } from '../../utils/formatSkillStatusType';
import classNames from 'classnames';
import { SkillHistoryDescriptionModal } from '../SkillHistoryDescriptionModal/SkillHistoryDescriptionModal';

interface SkillHistoryProps {
  skill: ISkillHistory;
}

export const SkillHistory: React.FC<SkillHistoryProps> = ({ skill }) => {
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
        <SkillHistoryDescriptionModal skill={skill} onClose={() => setOpenDescModal(false)} />
      )}
      {isOpenAuthModal && <ToAuthModal onClose={() => setOpenAuthModal(false)} />}
      <div className={style.skill}>
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
                Подробнее
              </Button>
            </div>
          </div>

          <div className={style.skill__text}>
            <b>{skill.skill}</b>
            <p>на</p>
            <b>{skill.exchange}</b>
          </div>

          <div className={style.skill__status}>
            {skill.status && (
              <Badge
                className={classNames(skill.status === 'CLOSED' && style.status_active)}
                text={formatSkillStatusType(skill.status)}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
