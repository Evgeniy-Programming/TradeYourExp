import { AuthLayout } from '../../layouts/AuthLayout/AuthLayout';
import A from '../../ui/A/A';
import Button from '../../ui/Button/Button';
import Input from '../../ui/Input/Input';
import InputPassword from '../../ui/InputPassword/InputPassword';
import style from './style.module.scss';

export const RegisterPage = () => {
  return (
    <AuthLayout>
      <form className={style.form}>
        <h2>Регистрация</h2>

        <div className={style.form__fields}>
          <div className={style.form__field}>
            <label htmlFor="username">
              Никнейм <span className={style.form__field__req}>*</span>
            </label>
            <Input id="username" />
          </div>
          <div className={style.form__field}>
            <label htmlFor="email">
              Email <span className={style.form__field__req}>*</span>
            </label>
            <Input id="email" />
          </div>
          <div className={style.form__field}>
            <label htmlFor="password">
              Пароль <span className={style.form__field__req}>*</span>
            </label>
            <InputPassword id="password" />
          </div>
          <div className={style.form__field}>
            <label htmlFor="firstName">Имя</label>
            <Input id="firstName" />
          </div>
          <div className={style.form__field}>
            <label htmlFor="lastName">Фамилия</label>
            <Input id="lastName" />
          </div>
          <div className={style.form__field}>
            <label htmlFor="social">Соц. сеть</label>
            <Input placeholder="Введите ссылку" id="social" />
          </div>
          <Button>Зарегистрироваться</Button>
          <p>
            Уже есть профиль? <A to="/login">Войти</A>
          </p>
          <p>
            Поля с <span className={style.form__field__req}>*</span> обязательны к заполнению
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};
