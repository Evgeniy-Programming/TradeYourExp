import { AddSkillForm } from '../../components/AddSkillForm/AddSkillForm';
import { LoginForm } from '../../components/LoginForm/LoginForm';
import { MainLogo } from '../../components/MainLogo/MainLogo';
import { RegisterForm } from '../../components/RegisterForm/RegisterForm';
import { Skill } from '../../components/Skill/Skill';
import { SkillFilter } from '../../components/SkillFilter/SkillFilter';
import Block from '../../ui/Block/Block';
import style from './style.module.css';

export const MainPage = () => {
  return (
    <div className={style.layout}>
      <div className={style.layout__auth}>
        <LoginForm />
        <RegisterForm />
      </div>

      <Block className={style.layout__main}>
        <MainLogo />
        <AddSkillForm />
        <SkillFilter />
        <div className={style.skills}>
          <h2>Предложения</h2>
        </div>
      </Block>
    </div>
  );
};
