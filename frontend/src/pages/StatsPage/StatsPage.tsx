import { useEffect } from 'react';
import { StarRating } from '../../components/StarRaiting/StarRaiting';
import { StatCard } from '../../components/StatCard/StatCard';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { useProfile } from '../../hooks/useProfile';
import { ProfileLayout } from '../../layouts/ProfileLayout/ProfileLayout';
import style from './style.module.scss';
import { authAPI } from '../../api/auth';
import { setErrorWithTimeout } from '../../store/slices/appSlice';
import { setProfileStats } from '../../store/slices/profileSlice';
import { StatAnimateCard } from '../../components/StatAnimateCard/StatAnimateCard';
import { useNavigate } from 'react-router-dom';
import { setHistorySkillsFilter } from '../../store/slices/skillSlice';

export const StatsPage = () => {
  useProfile();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const stats = useAppSelector((state) => state.profile.stats);

  useEffect(() => {
    const getProfileStats = async () => {
      try {
        const response = await authAPI.getProfileStats();
        dispatch(setProfileStats(response.data.data));
      } catch (error) {
        dispatch(setErrorWithTimeout(error));
      }
    };

    getProfileStats();
  }, [dispatch]);

  const handleToActiveSkills = () => {
    dispatch(setHistorySkillsFilter('ACTIVE'));
    navigate('/profile/history');
  };

  const handleToClosedSkills = () => {
    dispatch(setHistorySkillsFilter('CLOSED'));
    navigate('/profile/history');
  };

  if (!stats) {
    return <ProfileLayout>Загрузка данных...</ProfileLayout>;
  }

  return (
    <ProfileLayout>
      <div className={style.profile}>
        <h2>Ваша статистика</h2>
        <div className={style.profile__stars}>
          <StarRating rating={stats.raiting} />
          <b>{stats.raiting} / 5</b>
          <p className="label">оценка вашего профиля</p>
        </div>
        <div className={style.profile__stats}>
          <StatAnimateCard value={stats.successSkills} label="% успешных сделок" />
          <StatCard
            value={stats.activeSkills}
            label="активных сделок"
            color="green"
            onClick={handleToActiveSkills}
          />
          <StatCard
            value={stats.closedSkills}
            label="завершенных сделок"
            onClick={handleToClosedSkills}
          />
          <StatCard value={stats.uniquePartners} label="уникальных партнеров" />
        </div>
      </div>
    </ProfileLayout>
  );
};
