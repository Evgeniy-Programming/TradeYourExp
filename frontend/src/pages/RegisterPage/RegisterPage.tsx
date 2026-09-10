import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { AuthLayout } from '../../layouts/AuthLayout/AuthLayout';
import A from '../../ui/A/A';
import Button from '../../ui/Button/Button';
import Input from '../../ui/Input/Input';
import InputPassword from '../../ui/InputPassword/InputPassword';
import style from './style.module.scss';
import { useState } from 'react';
import { authAPI } from '../../api/auth';
import { setErrorWithTimeout } from '../../store/slices/appSlice';

export const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [fieldUsername, setFieldUsername] = useState('');
  const [fieldPassword, setFieldPassword] = useState('');
  const [fieldLink, setFieldLink] = useState('');
  const [fieldFirstName, setFieldFirstName] = useState('');
  const [fieldLastName, setFieldLastName] = useState('');
  const [fieldEmail, setFieldEmail] = useState('');

  const registration = async () => {
    try {
      await authAPI.registration({
        username: fieldUsername,
        email: fieldEmail,
        password: fieldPassword,
        link: fieldLink,
        firstName: fieldFirstName,
        lastName: fieldLastName,
      });

      navigate('/login');
    } catch (error) {
      dispatch(setErrorWithTimeout(error));
    }
  };

  return (
    <AuthLayout>
      <form className={style.form}>
        <h2>Регистрация</h2>

        <div className={style.form__fields}>
          <div className={style.form__field}>
            <label htmlFor="username">
              Никнейм <span className={style.form__field__req}>*</span>
            </label>
            <Input
              id="username"
              value={fieldUsername}
              onChange={(e) => setFieldUsername(e.target.value)}
            />
          </div>
          <div className={style.form__field}>
            <label htmlFor="email">
              Email <span className={style.form__field__req}>*</span>
            </label>
            <Input id="email" value={fieldEmail} onChange={(e) => setFieldEmail(e.target.value)} />
          </div>
          <div className={style.form__field}>
            <label htmlFor="password">
              Пароль <span className={style.form__field__req}>*</span>
            </label>
            <InputPassword
              id="password"
              value={fieldPassword}
              onChange={(e) => setFieldPassword(e.target.value)}
            />
          </div>
          <div className={style.form__field}>
            <label htmlFor="firstName">Имя</label>
            <Input
              id="firstName"
              value={fieldFirstName}
              onChange={(e) => setFieldFirstName(e.target.value)}
            />
          </div>
          <div className={style.form__field}>
            <label htmlFor="lastName">Фамилия</label>
            <Input
              id="lastName"
              value={fieldLastName}
              onChange={(e) => setFieldLastName(e.target.value)}
            />
          </div>
          <div className={style.form__field}>
            <label htmlFor="social">Соц. сеть</label>
            <Input
              placeholder="Введите ссылку"
              id="social"
              value={fieldLink}
              onChange={(e) => setFieldLink(e.target.value)}
            />
          </div>
          <Button onClick={registration}>Зарегистрироваться</Button>
          <p>
            Уже есть профиль? <A to="/login">Войти</A>
          </p>
          <p className="label">
            Поля с <span className={style.form__field__req}>*</span> обязательны к заполнению
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};
