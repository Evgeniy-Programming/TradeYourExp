import { useState } from 'react';
import classNames from 'classnames';

import style from './InputPassword.module.css';
import IconButton from '../IconButton/IconButton';
import EyeOpenSVG from '../svg/EyeOpenSVG';
import EyeClosedSVG from '../svg/EyeCloseSVG';

interface InputPasswordProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isMaxWidth?: boolean;
}

const InputPassword: React.FC<InputPasswordProps> = ({ isMaxWidth = false, ...rest }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div className={style.box}>
      <input
        type={isPasswordVisible ? 'text' : 'password'}
        className={classNames(style.input, isMaxWidth ? 'max-width' : '')}
        {...rest}
      />
      <IconButton
        icon={isPasswordVisible ? <EyeOpenSVG size={20} /> : <EyeClosedSVG size={20} />}
        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
      />
    </div>
  );
};

export default InputPassword;
