import classNames from 'classnames';

import style from './Input.module.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isMaxWidth?: boolean;
}

const Input: React.FC<InputProps> = ({ isMaxWidth = false, ...rest }) => {
  return <input className={classNames(style.input, isMaxWidth ? 'max-width' : '')} {...rest} />;
};

export default Input;
