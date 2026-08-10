import Background from '../Background/Background';

interface ModalImageProps {
  onClick: () => void;
  children: React.ReactNode;
}

const ModalImage: React.FC<ModalImageProps> = ({ onClick, children }) => {
  return <Background onClick={onClick}>{children}</Background>;
};

export default ModalImage;
