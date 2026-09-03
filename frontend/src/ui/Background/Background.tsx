import { useEffect } from 'react';
import style from './Background.module.scss';

interface BackgroundProps {
  onClick?: () => void;
  children: React.ReactNode;
}

const Background: React.FC<BackgroundProps> = ({ onClick, children }) => {
  useEffect(() => {
    document.body.style.overflowY = 'hidden';

    return () => {
      document.body.style.overflowY = 'visible';
    };
  }, []);

  return (
    <div className={style.background} onClick={() => onClick?.()}>
      {children}
    </div>
  );
};

export default Background;
