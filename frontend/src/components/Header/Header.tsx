import style from './Header.module.scss';
import A from './../../ui/A/A';
import Line from './../../ui/Line/Line';
import BurgerMenu from './../../ui/BurgerMenu/BurgerMenu';
import { useState } from 'react';
import logoIMG from '../../assets/img/logo.png';
import { useAppSelector } from '../../hooks/useAppDispatch';
import ArrowSVG from '../../ui/svg/ArrowSVG';
import Avatar from '../../ui/Avatar/Avatar';
import classNames from 'classnames';

export const Header = () => {
  const [isOpenBurger, setOpenBurger] = useState(false);
  const profile = useAppSelector((state) => state.profile.profile);

  return (
    <>
      <header className={style.header}>
        <div className={classNames('container', style.header__container)}>
          <nav className={style.header__nav}>
            <A to="/">
              <img src={logoIMG} alt="Логотип TradeYourExp" />
            </A>

            <div className={style.header__nav__links}>
              <A to="/create">Предложить обмен</A>
              <Line type="vertical" />
              <A to="/profile/stats">Статистика</A>
              <Line type="vertical" />
              <A to="/profile/history">История</A>
            </div>
          </nav>

          <div className={style.header__profile}>
            {profile && (
              <A to="/profile">
                <div className={style.profile}>
                  <Avatar profileAvatar={logoIMG} username="Username123" />
                  <ArrowSVG size={15} direction="right" />
                </div>
              </A>
            )}
            {!profile && (
              <>
                <A to="/login">Войти</A>
                <Line type="vertical" />
                <A to="/register">Зарегистрироваться</A>
              </>
            )}
          </div>

          <div className={style.header__button}>
            <BurgerMenu onClick={() => setOpenBurger((prev) => !prev)} />
          </div>
        </div>
      </header>
      {isOpenBurger && (
        <nav className={style.header__burger}>
          <A to="/">Обмены</A>
          {profile && (
            <>
              <A to="/create">Предложить обмен</A>
              <A to="/profile/stats">Статистика</A>
              <A to="/profile/history">История</A>
              <A to="/profile">Профиль</A>
            </>
          )}
          {!profile && (
            <>
              <A to="/login">Войти</A>
              <A to="/register">Зарегистрироваться</A>
            </>
          )}
        </nav>
      )}
    </>
  );
};
