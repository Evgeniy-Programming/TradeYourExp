import classNames from 'classnames';

import style from './IconButton.module.scss';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  text?: string;
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({ icon, text, className, ...rest }) => {
  return (
    <button
      className={classNames(style.iconButton, className ? className : '')}
      type="button"
      {...rest}
    >
      {icon}
      <div className={style.iconButton__text}>
        <p>{text}</p>
      </div>
    </button>
  );
};

export default IconButton;
