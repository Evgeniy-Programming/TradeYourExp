import { useEffect, useMemo, useState } from 'react';
import { ProfileLayout } from '../../layouts/ProfileLayout/ProfileLayout';
import ArrowSVG from '../../ui/svg/ArrowSVG';
import Dropdown from '../../ui/Dropdown/Dropdown';
import ButtonAction from '../../ui/ButtonAction/ButtonAction';
import Button from '../../ui/Button/Button';
import style from './style.module.scss';
import type { SkillHistorySearchType } from '../../types/skill';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { fetchHistorySkills } from '../../store/slices/skillSlice';
import { setErrorWithTimeout } from '../../store/slices/appSlice';
import { formatSkillHistorySearchType } from '../../utils/formatSkillStatusType';
import { SkillHistory } from '../../components/SkillHistory/SkillHistory';

const STATUS_ORDER: Record<string, number> = {
  ACTIVE: 0,
  PENDING: 1,
  FREEZE: 2,
  REJECTED: 3,
  CLOSED: 4,
};

export const HistoryPage = () => {
  const [isOpenSelect, setOpenSelect] = useState(false);
  const [selectedSearchType, setSearchType] = useState<SkillHistorySearchType>('ALL');

  const skills = useAppSelector((state) => state.skill.historySkills);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchHistorySkills())
      .unwrap()
      .catch((error) => dispatch(setErrorWithTimeout(error)));
  }, [dispatch]);

  const filteredSkills = useMemo(() => {
    const filtered = (() => {
      switch (selectedSearchType) {
        case 'ACTIVE':
          return skills.filter((skill) => skill.status === 'ACTIVE');
        case 'CLOSED':
          return skills.filter((skill) => skill.status === 'CLOSED');
        case 'ALL':
        default:
          return skills;
      }
    })();

    return [...filtered].sort((a, b) => {
      const orderA = STATUS_ORDER[a.status] ?? Number.MAX_SAFE_INTEGER;
      const orderB = STATUS_ORDER[b.status] ?? Number.MAX_SAFE_INTEGER;

      if (orderA !== orderB) return orderA - orderB;

      // createdAt — строка ISO 8601
      const timeA = Date.parse(a.createdAt);
      const timeB = Date.parse(b.createdAt);

      if (Number.isNaN(timeA) || Number.isNaN(timeB)) return 0;

      return timeB - timeA;
    });
  }, [skills, selectedSearchType]);

  return (
    <ProfileLayout>
      <div className={style.profile}>
        <div className={style.profile__title}>
          <h2>{formatSkillHistorySearchType(selectedSearchType)} сделки</h2>

          <div className={style.profile__title__select}>
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

        <div className={style.profile__skills}>
          {filteredSkills.map((skill) => (
            <SkillHistory key={skill.id} skill={skill} />
          ))}
        </div>
      </div>
    </ProfileLayout>
  );
};
