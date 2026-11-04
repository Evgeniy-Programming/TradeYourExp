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
import { useTranslation } from 'react-i18next';

export const RegisterPage = () => {
  const { t } = useTranslation();
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
      <form className={style.form} onSubmit={(e) => e.preventDefault()}>
        <h2>{t('auth.registerTitle')}</h2>

        <div className={style.form__fields}>
          <div className={style.form__field}>
            <label htmlFor="username">
              {t('auth.usernameLabel')} <span className={style.form__field__req}>*</span>
            </label>
            <Input
              id="username"
              autoComplete="username"
              value={fieldUsername}
              onChange={(e) => setFieldUsername(e.target.value)}
            />
          </div>
          <div className={style.form__field}>
            <label htmlFor="email">
              {t('auth.emailLabel')} <span className={style.form__field__req}>*</span>
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={fieldEmail}
              onChange={(e) => setFieldEmail(e.target.value)}
            />
          </div>
          <div className={style.form__field}>
            <label htmlFor="password">
              {t('auth.passwordLabel')} <span className={style.form__field__req}>*</span>
            </label>
            <InputPassword
              id="password"
              autoComplete="new-password"
              value={fieldPassword}
              onChange={(e) => setFieldPassword(e.target.value)}
            />
          </div>
          <div className={style.form__field}>
            <label htmlFor="firstName">{t('auth.firstNameLabel')}</label>
            <Input
              id="firstName"
              autoComplete="given-name"
              value={fieldFirstName}
              onChange={(e) => setFieldFirstName(e.target.value)}
            />
          </div>
          <div className={style.form__field}>
            <label htmlFor="lastName">{t('auth.lastNameLabel')}</label>
            <Input
              id="lastName"
              autoComplete="family-name"
              value={fieldLastName}
              onChange={(e) => setFieldLastName(e.target.value)}
            />
          </div>
          <div className={style.form__field}>
            <label htmlFor="social">{t('auth.socialLabel')}</label>
            <Input
              id="social"
              type="url"
              placeholder={t('auth.socialPlaceholder')}
              autoComplete="url"
              value={fieldLink}
              onChange={(e) => setFieldLink(e.target.value)}
            />
          </div>
        </div>

        <Button type="submit" isMaxWidth onClick={registration}>
          {t('auth.registerButton')}
        </Button>

        <p className={style.form__footer}>
          {t('auth.haveProfile')} <A to="/login">{t('auth.loginButton')}</A>
        </p>

        <p className={style.form__hint}>{t('auth.requiredHint')}</p>
      </form>
    </AuthLayout>
  );
};
