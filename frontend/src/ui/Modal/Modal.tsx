import Background from '../Background/Background';
import style from './Modal.module.scss';
import Close from '../Close/Close';
import Block from '../Block/Block';
import classNames from 'classnames';

interface ModalProps {
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClick, className, children }) => {
  return (
    <Background onClick={onClick}>
      <Block className={classNames(style.modal, className)} onClick={(e) => e.stopPropagation()}>
        <div className={style.modal__close}>
          <Close onClick={onClick} />
        </div>
        {children}
      </Block>
    </Background>
  );
};

export default Modal;
