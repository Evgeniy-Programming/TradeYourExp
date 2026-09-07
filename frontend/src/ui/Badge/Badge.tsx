import classNames from 'classnames';
import style from './Badge.module.scss';

interface BadgeProps {
  text: string;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ text, className }) => {
  return (
    <div className={classNames(style.badge, !className && style.badge__bg, className)}>{text}</div>
  );
};

export default Badge;
