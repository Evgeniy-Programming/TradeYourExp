import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import style from './LanguageSwitcher.module.scss';
import ArrowSVG from '../svg/ArrowSVG';

export type LanguageCode = 'ru' | 'en' | 'zh';

const LANGUAGES: { code: LanguageCode; label: string; flag: string }[] = [
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
];

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className }) => {
  const { i18n } = useTranslation();
  const [isOpen, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentCode = (i18n.language as LanguageCode) || 'ru';
  const currentLanguage = LANGUAGES.find((l) => l.code === currentCode) ?? LANGUAGES[0];

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (code: LanguageCode) => {
    setOpen(false);
    i18n.changeLanguage(code);
    localStorage.setItem('language', code);
  };

  return (
    <div ref={ref} className={classNames(style.switcher, className)}>
      <button
        type="button"
        className={style.switcher__trigger}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        title={currentLanguage.label}
      >
        <span className={style.switcher__flag}>{currentLanguage.flag}</span>
        <span className={style.switcher__code}>{currentCode.toUpperCase()}</span>
        <ArrowSVG size={12} direction={isOpen ? 'up' : 'down'} />
      </button>

      {isOpen && (
        <ul className={style.switcher__menu} role="listbox">
          {LANGUAGES.map((language) => (
            <li key={language.code} role="option" aria-selected={language.code === currentCode}>
              <button
                type="button"
                className={classNames(
                  style.switcher__option,
                  language.code === currentCode && style.switcher__option_active
                )}
                onClick={() => handleSelect(language.code)}
              >
                <span className={style.switcher__flag}>{language.flag}</span>
                <span className={style.switcher__label}>{language.label}</span>
                <span className={style.switcher__optionCode}>{language.code.toUpperCase()}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;
