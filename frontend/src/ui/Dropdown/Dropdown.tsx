import { useEffect, useRef } from 'react';

import style from './Dropdown.module.scss';
import Close from '../Close/Close';
import classNames from 'classnames';
import Block from '../Block/Block';

interface DropdownProps {
  isShowCloseImg?: boolean;
  dropdownClose?: () => void;
  children: React.ReactNode;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  isShowCloseImg = false,
  dropdownClose,
  children,
  className,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        dropdownClose?.();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownClose]);

  return (
    <Block ref={dropdownRef} className={classNames(style.dropdown, className)}>
      {isShowCloseImg && <Close />}
      {children}
    </Block>
  );
};

export default Dropdown;
