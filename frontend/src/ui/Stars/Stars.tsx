import classNames from 'classnames';

import style from './Stars.module.scss';

interface StarsProps {
  /** Оценка от 1 до 5. Может быть дробной для среднего рейтинга. */
  value: number;
  /** Размер звезды в px. По умолчанию 18. */
  size?: number;
  /** Показывать ли число рядом. */
  showValue?: boolean;
  className?: string;
}

const Stars: React.FC<StarsProps> = ({ value, size = 18, showValue = false, className }) => {
  const clamped = Math.max(0, Math.min(5, value));

  return (
    <span className={classNames(style.stars, className)}>
      <span className={style.stars__row} style={{ fontSize: size }} aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => {
          // Заливка: полная, если i <= floor, частичная — если i === ceil и дробная часть
          const fill = Math.min(1, Math.max(0, clamped - (i - 1)));
          return (
            <span key={i} className={style.stars__item}>
              <span className={style.stars__empty}>★</span>
              <span className={style.stars__fill} style={{ width: `${fill * 100}%` }}>
                ★
              </span>
            </span>
          );
        })}
      </span>
      {showValue && <span className={style.stars__value}>{clamped.toFixed(1)}</span>}
    </span>
  );
};

export default Stars;
