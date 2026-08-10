import style from './TextLink.module.scss';
import { Link } from 'react-router';
import ArrowSVG from '../svg/ArrowSVG';

interface TextLinkProps {
  to: string;
  children: React.ReactNode;
}

const TextLink: React.FC<TextLinkProps> = ({ to, children }) => {
  return (
    <Link to={to} className={style.textLink}>
      {children}
      <ArrowSVG />
    </Link>
  );
};

export default TextLink;
