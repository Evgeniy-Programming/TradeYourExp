import style from './Close.module.scss';
import CloseSVG from './../svg/CloseSVG';

interface CloseProps {
  onClick?: () => void;
}

const Close: React.FC<CloseProps> = ({ onClick }) => {
  return (
    <button className={style.close} type="button" onClick={onClick} title="Закрыть">
      <CloseSVG color="var(--color-element)" />
    </button>
  );
};

export default Close;
