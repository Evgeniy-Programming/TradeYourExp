import classNames from 'classnames';

import style from './ButtonSecondary.module.scss';

interface ButtonSecondaryProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
  isMaxWidth?: boolean;
  isDanger?: boolean;
  isCircle?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

const ButtonSecondary: React.FC<ButtonSecondaryProps> = ({
  onClick,
  isMaxWidth = false,
  isDanger = false,
  isCircle = false,
  disabled = false,
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
        style.buttonSecondary,
        isMaxWidth && 'max-width',
        isDanger && style.buttonSecondary_danger,
        isCircle && style.button_circle,
        disabled && style.button_disabled,
        className
      )}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </button>
  );
};

export default ButtonSecondary;
