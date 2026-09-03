import Background from '../Background/Background';
import style from './ModalElement.module.scss';
import Block from '../Block/Block';
import classNames from 'classnames';
import IconButton from '../IconButton/IconButton';
import MinimizeSVG from '../svg/MinimizeSVG';

interface ModalElementProps {
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}

const ModalElement: React.FC<ModalElementProps> = ({ onClick, className, children }) => {
  return (
    <Background onClick={onClick}>
      <Block className={classNames(style.modal, className)} onClick={(e) => e.stopPropagation()}>
        <div className={style.modal__close}>
          <IconButton icon={<MinimizeSVG />} onClick={onClick} />
        </div>
        {children}
      </Block>
    </Background>
  );
};

export default ModalElement;
