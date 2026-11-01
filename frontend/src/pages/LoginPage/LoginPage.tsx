import { useState } from 'react';
import { AuthLayout } from '../../layouts/AuthLayout/AuthLayout';
import A from '../../ui/A/A';
import Button from '../../ui/Button/Button';
import Input from '../../ui/Input/Input';
import InputPassword from '../../ui/InputPassword/InputPassword';
import style from './style.module.scss';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { authAPI } from '../../api/auth';
import { setErrorWithTimeout } from '../../store/slices/appSlice';
import { useNavigate } from 'react-router-dom';
import { setProfile } from '../../store/slices/profileSlice';
import type { LoginType } from '../../types/auth';

export const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [fieldLogin, setFieldLogin] = useState('');
  const [fieldPassword, setFieldPassword] = useState('');

  const login = async () => {
    let loginType: LoginType;

    if (fieldLogin.includes('@')) {
      loginType = 'email';
    } else {
      loginType = 'username';
    }

    try {
      await authAPI.login({
        type: loginType,
        login: fieldLogin,
        password: fieldPassword,
      });

      dispatch(setProfile(await authAPI.getMe()));
      navigate('/');
    } catch (error) {
      dispatch(setErrorWithTimeout(error));
    }
  };

  return (
    <AuthLayout>
      <form className={style.form} onSubmit={(e) => e.preventDefault()}>
        <h2>Вход в профиль</h2>

        <div className={style.form__fields}>
          <div className={style.form__field}>
            <label htmlFor="login">Никнейм или Email</label>
            <Input
              id="login"
              value={fieldLogin}
              autoComplete="username"
              onChange={(e) => setFieldLogin(e.target.value)}
            />
          </div>
          <div className={style.form__field}>
            <label htmlFor="password">Пароль</label>
            <InputPassword
              id="password"
              value={fieldPassword}
              autoComplete="current-password"
              onChange={(e) => setFieldPassword(e.target.value)}
            />
          </div>
        </div>

        <Button type="submit" isMaxWidth onClick={login}>
          Войти
        </Button>

        <p className={style.form__footer}>
          Нет профиля? <A to="/register">Зарегистрироваться</A>
        </p>
      </form>
    </AuthLayout>
  );
};
