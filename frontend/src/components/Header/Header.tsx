import style from './style.module.scss';
import A from './../../ui/A/A';
import Line from './../../ui/Line/Line';
import BurgerMenu from './../../ui/BurgerMenu/BurgerMenu';
import LanguageSwitcher from './../../ui/LanguageSwitcher/LanguageSwitcher';
import { useState } from 'react';
import logoIMG from '../../assets/img/logo.png';
import { useAppSelector } from '../../hooks/useAppDispatch';
import ArrowSVG from '../../ui/svg/ArrowSVG';
import classNames from 'classnames';
import PlusSVG from '../../ui/svg/PlusSVG';
import { useTranslation } from 'react-i18next';
import UserAvatar from '../UserAvatar/UserAvatar';

export const Header = () => {
  const { t } = useTranslation();
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
              <A to="/create" className={style.header__cta}>
                <PlusSVG size={16} />
                {t('header.createExchange')}
              </A>
              <Line type="vertical" />
              <A to="/profile/stats">{t('header.stats')}</A>
              <Line type="vertical" />
              <A to="/profile/history">{t('header.history')}</A>
            </div>
          </nav>

          <div className={style.header__right}>
            <LanguageSwitcher className={style.header__lang} />

            <div className={style.header__profile}>
              {profile && (
                <A to="/profile">
                  <div className={style.profile}>
                    <UserAvatar profileAvatar={profile.avatar} username={profile.username} />
                    <ArrowSVG size={15} direction="right" />
                  </div>
                </A>
              )}
              {!profile && (
                <>
                  <A to="/login">{t('header.login')}</A>
                  <Line type="vertical" />
                  <A to="/register">{t('header.register')}</A>
                </>
              )}
            </div>

            <div className={style.header__button}>
              <BurgerMenu onClick={() => setOpenBurger((prev) => !prev)} />
            </div>
          </div>
        </div>
      </header>
      {isOpenBurger && (
        <nav className={style.header__burger} aria-label="Мобильная навигация">
          <A to="/">{t('header.exchanges')}</A>
          {profile && (
            <>
              <A to="/create" className={style.header__burger_cta}>
                <PlusSVG size={18} />
                {t('header.createExchange')}
              </A>
              <A to="/profile/stats">{t('header.stats')}</A>
              <A to="/profile/history">{t('header.history')}</A>
              <A to="/profile">{t('header.profile')}</A>
            </>
          )}
          {!profile && (
            <>
              <A to="/login">{t('header.login')}</A>
              <A to="/register">{t('header.register')}</A>
            </>
          )}
        </nav>
      )}
    </>
  );
};
