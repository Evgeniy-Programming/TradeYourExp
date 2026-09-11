import React from 'react';
import style from './StatAnimateCard.module.scss';

interface StatAnimateCardProps {
  value: number;
  label?: string;
  isRaiting?: boolean;
  recomendation?: string;
}

export const StatAnimateCard: React.FC<StatAnimateCardProps> = ({
  value,
  label,
  isRaiting,
  recomendation,
}) => {
  const normalizedValue = Math.min(Math.max(value, 0), 100);

  const getColorClass = (val: number): string => {
    if (isRaiting) {
      if (val <= 2) return style.danger;
      if (val < 4) return style.warning;
      return style.success;
    }

    if (val <= 40) return style.danger;
    if (val <= 70) return style.warning;
    return style.success;
  };

  const colorClass = getColorClass(normalizedValue);

  return (
    <div className={`${style.card} ${colorClass}`}>
      <div
        className={style.wave_wrapper}
        style={{ height: `${isRaiting ? normalizedValue * 20 : normalizedValue}%` }}
      >
        <svg
          className={`${style.wave} ${style.wave_front}`}
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path d="M0,60 C150,100 350,20 500,60 C650,100 850,20 1000,60 C1150,100 1350,20 1500,60 L1500,120 L0,120 Z" />
        </svg>
        <svg
          className={`${style.wave} ${style.wave_back}`}
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path d="M0,60 C150,20 350,100 500,60 C650,20 850,100 1000,60 C1150,20 1350,100 1500,60 L1500,120 L0,120 Z" />
        </svg>
      </div>

      <div className={style.content}>
        <span className={style.value}>{isRaiting ? normalizedValue : normalizedValue}</span>
        {label && <span className={style.label}>{label}</span>}
        {recomendation && <span className={style.label_rec}>{recomendation}</span>}
      </div>
    </div>
  );
};
