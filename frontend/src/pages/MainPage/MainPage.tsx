import { SkillFilter } from '../../components/SkillFilter/SkillFilter';
import { GeneralLayout } from '../../layouts/GeneralLayout/GeneralLayout';
import style from './style.module.scss';

export const MainPage = () => {
  return (
    <GeneralLayout>
      <SkillFilter />
      <div className={style.skills}>
        <p>fewrgegege</p>
        <p>fewrgegege</p>
      </div>
    </GeneralLayout>
  );
};
