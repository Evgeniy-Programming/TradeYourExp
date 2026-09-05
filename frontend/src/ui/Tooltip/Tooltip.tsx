import classNames from 'classnames';

import style from './Tooltip.module.scss';
import { useState } from 'react';
import InformationSVG from '../svg/InformationSVG';

interface TooltipProps {
  text: string;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ text, className }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className={classNames(style.tooltip, className)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <InformationSVG color="var(--color-element)" size={20} />
      {visible && <p className={style.tooltip__content}>{text}</p>}
    </div>
  );
};

export default Tooltip;
