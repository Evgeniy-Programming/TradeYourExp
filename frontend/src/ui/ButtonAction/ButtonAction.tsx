import classNames from 'classnames';
import style from './ButtonAction.module.scss';

interface ButtonActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
  isMaxWidth?: boolean;
  isGray?: boolean;
  isDanger?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const ButtonAction: React.FC<ButtonActionProps> = ({
  onClick,
  isMaxWidth = false,
  isGray = false,
  isDanger = false,
  disabled = false,
  icon,
  children,
  className,
  ...rest
}) => {
  const handleClick = () => {
    if (!disabled) {
      onClick?.();
    }
  };

  return (
    <button
      type="button"
      className={classNames(
        style.buttonAction,
        isMaxWidth && 'max-width',
        isDanger && style.buttonAction_danger,
        disabled && style.buttonAction_disabled,
        isGray && style.buttonAction_gray,
        className
      )}
      onClick={handleClick}
      {...rest}
    >
      {icon && <div className={style.buttonAction__icon}>{icon}</div>}
      {children}
    </button>
  );
};

export default ButtonAction;
