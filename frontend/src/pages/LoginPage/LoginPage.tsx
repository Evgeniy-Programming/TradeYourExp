import { AuthLayout } from '../../layouts/AuthLayout/AuthLayout';
import A from '../../ui/A/A';
import Button from '../../ui/Button/Button';
import Input from '../../ui/Input/Input';
import InputPassword from '../../ui/InputPassword/InputPassword';
import style from './style.module.scss';

export const LoginPage = () => {
  return (
    <AuthLayout>
      <form className={style.form}>
        <h2>Вход в профиль</h2>

        <div className={style.form__fields}>
          <div className={style.form__field}>
            <label htmlFor="username">Никнейм</label>
            <Input id="username" />
          </div>
          <div className={style.form__field}>
            <label htmlFor="password">Пароль</label>
            <InputPassword id="password" />
          </div>
          <Button>Войти</Button>
          <p>
            Нет профиля? <A to="/register">Зарегистрироваться</A>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};
