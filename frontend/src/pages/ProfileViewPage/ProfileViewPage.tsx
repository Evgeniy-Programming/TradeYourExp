import { useParams } from 'react-router-dom';
import { ProfileViewLayout } from '../../layouts/ProfileViewLayout/ProfileViewLayout';
import style from './style.module.scss';
import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { setErrorWithTimeout } from '../../store/slices/appSlice';
import { authAPI } from '../../api/auth';
import { setProfileView } from '../../store/slices/profileSlice';
import { StatAnimateCard } from '../../components/StatAnimateCard/StatAnimateCard';
import { StatCard } from '../../components/StatCard/StatCard';
import type { SkillHistorySearchType } from '../../types/skill';
import {
  formatSkillHistorySearchType,
  formatSkillHistoryViewTextType,
} from '../../utils/formatSkillStatusType';
import ArrowSVG from '../../ui/svg/ArrowSVG';
import ButtonAction from '../../ui/ButtonAction/ButtonAction';
import Dropdown from '../../ui/Dropdown/Dropdown';
import Button from '../../ui/Button/Button';
import { SkillHistory } from '../../components/SkillHistory/SkillHistory';
import { skillAPI } from '../../api/skill';
import { setHistorySkillsFilter, setHistoryViewSkills } from '../../store/slices/skillSlice';

export const ProfileViewPage = () => {
  const { profileId } = useParams();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile.profileView);

  const skillsFilter = useAppSelector((state) => state.skill.historySkillsFilter);
  const [isOpenSelect, setOpenSelect] = useState(false);
  const [selectedSearchType, setSearchType] = useState<SkillHistorySearchType>(skillsFilter);

  const skills = useAppSelector((state) => state.skill.historyViewSkills);
  const filteredSkills = useMemo(() => {
    switch (selectedSearchType) {
      case 'ACTIVE':
        return skills.filter((skill) => skill.status === 'ACTIVE');
      case 'CLOSED':
        return skills.filter((skill) => skill.status === 'CLOSED');
      case 'ALL':
      default:
        return skills;
    }
  }, [skills, selectedSearchType]);

  useEffect(() => {
    if (!profileId) return;

    const getProfile = async () => {
      try {
        const response = await authAPI.getProfile(profileId);

        dispatch(setProfileView(response.data.result));
      } catch (error) {
        dispatch(setErrorWithTimeout(error));
      }
    };

    getProfile();
  }, [profileId, dispatch]);

  useEffect(() => {
    if (!profileId) return;

    const getSkills = async () => {
      try {
        const response = await skillAPI.getByProfileId(profileId);

        dispatch(setHistoryViewSkills(response.data.result));
      } catch (error) {
        dispatch(setErrorWithTimeout(error));
      }
    };

    getSkills();
  }, [dispatch, profileId]);

  if (!profileId || !profile) {
    return (
      <ProfileViewLayout>
        <p>Загрузка...</p>
      </ProfileViewLayout>
    );
  }

  const handleToActiveSkills = () => {
    setHistorySkillsFilter('ACTIVE');
  };

  const handleToClosedSkills = () => {
    setHistorySkillsFilter('CLOSED');
  };

  return (
    <ProfileViewLayout>
      <section className={style.page}>
        <h2>Профиль {profile.username}</h2>

        <article className={style.page__article}>
          <h3>Статистика</h3>

          <div className={style.page__stats}>
            <StatAnimateCard value={profile.stats.successSkills} label="% успешных сделок" />
            <StatCard
              value={profile.stats.activeSkills}
              label="активных сделок"
              color="green"
              onClick={handleToActiveSkills}
            />
            <StatCard
              value={profile.stats.closedSkills}
              label="завершенных сделок"
              onClick={handleToClosedSkills}
            />
            <StatCard value={profile.stats.uniquePartners} label="уникальных партнеров" />
          </div>
        </article>

        <article className={style.page__article}>
          <div className={style.page__history}>
            <div className={style.page__history__title}>
              <h3>История {formatSkillHistoryViewTextType(selectedSearchType)} сделок</h3>

              <div className={style.page__history__title__select}>
                <ButtonAction
                  icon={<ArrowSVG direction={isOpenSelect ? 'down' : 'up'} />}
                  onClick={() => setOpenSelect(true)}
                >
                  <p>{formatSkillHistorySearchType(selectedSearchType)}</p>
                </ButtonAction>
                {isOpenSelect && (
                  <Dropdown dropdownClose={() => setOpenSelect(false)} className={style.select}>
                    <Button onClick={() => setSearchType('ALL')}>Все</Button>
                    <Button onClick={() => setSearchType('ACTIVE')}>Активные</Button>
                    <Button onClick={() => setSearchType('CLOSED')}>Завершенные</Button>
                  </Dropdown>
                )}
              </div>
            </div>

            <div className={style.page__history__skills}>
              {filteredSkills.map((skill) => (
                <SkillHistory key={skill.id} skill={skill} />
              ))}
            </div>
          </div>
        </article>
      </section>
    </ProfileViewLayout>
  );
};
