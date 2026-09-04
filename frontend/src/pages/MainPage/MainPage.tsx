import { Skill } from '../../components/Skill/Skill';
import { SkillFilter } from '../../components/SkillFilter/SkillFilter';
import { useAppSelector } from '../../hooks/useAppDispatch';
import { GeneralLayout } from '../../layouts/GeneralLayout/GeneralLayout';
import style from './style.module.scss';

export const MainPage = () => {
  const skills = useAppSelector((state) => state.skill.skills);

  return (
    <GeneralLayout>
      <h1 className={style.title}>Обмен навыками</h1>
      <SkillFilter />
      <div className={style.skills}>
        {skills.map((skill) => (
          <Skill
            key={skill.id}
            contactType="site"
            authorSkill={skill.skill}
            requestSkill={skill.exchange}
            author="author"
            username={skill.username}
          />
        ))}
      </div>
    </GeneralLayout>
  );
};
