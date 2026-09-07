import classNames from 'classnames';

import style from './Input.module.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isMaxWidth?: boolean;
  className?: string;
}

const Input: React.FC<InputProps> = ({ isMaxWidth = false, className, ...rest }) => {
  return (
    <input
      className={classNames(
        style.input,
        isMaxWidth ? 'max-width' : '',
        rest.disabled && style.disabled,
        className
      )}
      {...rest}
    />
  );
};

export default Input;
