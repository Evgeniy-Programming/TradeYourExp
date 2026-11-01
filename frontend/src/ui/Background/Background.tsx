import { useEffect, useRef } from 'react';
import style from './Background.module.scss';

interface BackgroundProps {
  onClick?: () => void;
  children: React.ReactNode;
}

const Background: React.FC<BackgroundProps> = ({ onClick, children }) => {
  const isMouseDownOnBackground = useRef(false);

  useEffect(() => {
    document.body.style.overflowY = 'hidden';

    return () => {
      document.body.style.overflowY = 'visible';
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Запоминаем, что mousedown был именно на фоне, а не на дочернем элементе
    isMouseDownOnBackground.current = e.target === e.currentTarget;
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    // Закрываем только если mousedown был на фоне И mouseup тоже на фоне
    if (isMouseDownOnBackground.current && e.target === e.currentTarget) {
      onClick?.();
    }
    isMouseDownOnBackground.current = false;
  };

  return (
    <div className={style.background} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
      {children}
    </div>
  );
};

export default Background;
