import style from './Close.module.scss';
import CloseSVG from './../svg/CloseSVG';

interface CloseProps {
  onClick?: () => void;
  color?: string;
}

const Close: React.FC<CloseProps> = ({ onClick, color = 'var(--color-element)' }) => {
  return (
    <button className={style.close} type="button" onClick={onClick} title="Закрыть">
      <CloseSVG color={color} />
    </button>
  );
};

export default Close;
