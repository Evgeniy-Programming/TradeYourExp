import { LoginForm } from '../../components/LoginForm/LoginForm';
import { RegisterForm } from '../../components/RegisterForm/RegisterForm';
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
        <p>Hello world</p>
      </Block>
    </div>
  );
};
