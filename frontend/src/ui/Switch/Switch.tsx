import classNames from 'classnames';

import style from './Switch.module.scss';

interface SwitchProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onChange' | 'type'
> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  className,
  ...rest
}) => {
  const handleClick = () => {
    if (disabled) return;
    onChange(!checked);
  };

  return (
    <label className={classNames(style.switch, disabled && style.switch_disabled, className)}>
      {label !== undefined && <span className={style.switch__label}>{label}</span>}

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={classNames(style.switch__control, checked && style.switch__control_active)}
        onClick={handleClick}
        {...rest}
      >
        <span className={style.switch__thumb} />
      </button>
    </label>
  );
};

export default Switch;
