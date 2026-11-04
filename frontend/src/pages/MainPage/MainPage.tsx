import classNames from 'classnames';
import { Skill } from '../../components/Skill/Skill';
import { SkillFilter } from '../../components/SkillFilter/SkillFilter';
import { useAppSelector } from '../../hooks/useAppDispatch';
import { GeneralLayout } from '../../layouts/GeneralLayout/GeneralLayout';
import style from './style.module.scss';
import { useTranslation } from 'react-i18next';

export const MainPage = () => {
  const { t } = useTranslation();
  const skills = useAppSelector((state) => state.skill.skills);

  return (
    <GeneralLayout>
      <h1 className={style.title}>{t('main.title')}</h1>
      <SkillFilter />
      <p className={classNames('label', style.label)}>{t('main.results')}</p>
      <div className={style.skills}>
        {skills.length === 0 ? (
          <div className={style.empty}>{t('main.noExchanges')}</div>
        ) : (
          skills.map((skill) => <Skill key={skill.id} skill={skill} />)
        )}
      </div>
    </GeneralLayout>
  );
};
