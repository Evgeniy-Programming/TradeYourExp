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
import { useTranslation } from 'react-i18next';

export const LoginPage = () => {
  const { t } = useTranslation();
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
        <h2>{t('auth.loginTitle')}</h2>

        <div className={style.form__fields}>
          <div className={style.form__field}>
            <label htmlFor="login">{t('auth.loginLabel')}</label>
            <Input
              id="login"
              value={fieldLogin}
              autoComplete="username"
              onChange={(e) => setFieldLogin(e.target.value)}
            />
          </div>
          <div className={style.form__field}>
            <label htmlFor="password">{t('auth.passwordLabel')}</label>
            <InputPassword
              id="password"
              value={fieldPassword}
              autoComplete="current-password"
              onChange={(e) => setFieldPassword(e.target.value)}
            />
          </div>
        </div>

        <Button type="submit" isMaxWidth onClick={login}>
          {t('auth.loginButton')}
        </Button>

        <p className={style.form__footer}>
          {t('auth.noProfile')} <A to="/register">{t('auth.registerButton')}</A>
        </p>
      </form>
    </AuthLayout>
  );
};
