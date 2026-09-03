import style from './Chip.module.scss';
import Close from '../Close/Close';

interface CloseProps {
  onClose?: () => void;
  text: string;
}

const Chip: React.FC<CloseProps> = ({ onClose, text }) => {
  return (
    <div className={style.chip}>
      <Close onClick={onClose} />
      <p className={style.chip__text}>{text}</p>
    </div>
  );
};

export default Chip;
