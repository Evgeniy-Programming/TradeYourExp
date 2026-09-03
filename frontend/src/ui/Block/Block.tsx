import classNames from 'classnames';

import style from './Block.module.scss';

interface BlockProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

const Block: React.FC<BlockProps> = ({ children, className, ref, ...rest }) => {
  return (
    <div ref={ref} className={classNames(style.block, className)} {...rest}>
      {children}
    </div>
  );
};

export default Block;
