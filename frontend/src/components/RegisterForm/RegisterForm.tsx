import { useState } from 'react';
import Button from '../../ui/Button/Button';
import Input from '../../ui/Input/Input';
import Block from '../../ui/Block/Block';
import style from './style.module.css';

export const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [link, setLink] = useState('');

  const submitFormHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <Block className={style.box}>
      <h3 className={style.title}>Создать аккаунт</h3>
      <form onSubmit={submitFormHandler} className={style.form}>
        <Input
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          placeholder="Имя (по желанию)"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <Input
          placeholder="Фамилия (по желанию)"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <Input
          placeholder="Ссылка на соц. сеть (по желанию)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <Button type="submit">Создать аккаунт</Button>
      </form>
    </Block>
  );
};
