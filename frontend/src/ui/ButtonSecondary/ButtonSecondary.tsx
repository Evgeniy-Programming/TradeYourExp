import classNames from 'classnames';

import style from './ButtonSecondary.module.css';

interface ButtonSecondaryProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
  isMaxWidth?: boolean;
  isDanger?: boolean;
  isCircle?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

const ButtonSecondary: React.FC<ButtonSecondaryProps> = ({
  onClick,
  isMaxWidth = false,
  isDanger = false,
  isCircle = false,
  disabled = false,
  children,
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
        disabled && style.button_disabled
      )}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </button>
  );
};

export default ButtonSecondary;
