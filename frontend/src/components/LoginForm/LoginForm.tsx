import { useState } from 'react';
import Button from '../../ui/Button/Button';
import Input from '../../ui/Input/Input';
import Block from '../../ui/Block/Block';
import style from './style.module.css';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submitFormHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <Block className={style.box}>
      <h3 className={style.title}>Авторизация</h3>
      <form onSubmit={submitFormHandler} className={style.form}>
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Войти</Button>
      </form>
    </Block>
  );
};
