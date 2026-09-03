import { useState } from 'react';
import classNames from 'classnames';

import style from './BurgerMenu.module.scss';

interface BurgerMenuProps {
  onClick: () => void;
}

const BurgerMenu: React.FC<BurgerMenuProps> = ({ onClick }) => {
  const [isOpen, setOpen] = useState(false);

  const handleClickMenu = () => {
    setOpen(!isOpen);
    onClick();
  };

  return (
    <div
      className={classNames(style.burgerMenu, isOpen ? style.burgerMenu_open : '')}
      onClick={() => handleClickMenu()}
    >
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};

export default BurgerMenu;
