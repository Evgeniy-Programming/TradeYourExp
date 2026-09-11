import React from 'react';
import style from './StatCard.module.scss';
import classNames from 'classnames';
import IconButton from '../../ui/IconButton/IconButton';
import ArrowSVG from '../../ui/svg/ArrowSVG';

interface StatCardProps {
  value: number;
  label?: string;
  color?: 'green' | 'blue' | 'red' | 'yellow' | 'light';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({ value, label, color = 'light', onClick }) => {
  return (
    <div className={classNames(style.card, style[`card__color_${color}`])}>
      {onClick && (
        <IconButton icon={<ArrowSVG size={20} />} onClick={onClick} className={style.card__arrow} />
      )}
      <b>{value}</b>
      <p className="label">{label}</p>
    </div>
  );
};
