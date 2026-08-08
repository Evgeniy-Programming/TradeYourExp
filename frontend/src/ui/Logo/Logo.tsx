import { Link } from 'react-router';

interface AProps {
  to: string;
  children: React.ReactNode;
}

const Logo: React.FC<AProps> = ({ to, children }) => {
  return <Link to={to}>{children}</Link>;
};

export default Logo;
