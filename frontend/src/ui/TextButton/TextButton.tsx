import style from './TextButton.module.scss';

interface TextButtonProps {
  onClick: () => void;
  text: string;
}

const TextButton: React.FC<TextButtonProps> = ({ onClick, text }) => {
  return (
    <button onClick={onClick} className={style.textButton}>
      {text}
    </button>
  );
};

export default TextButton;
