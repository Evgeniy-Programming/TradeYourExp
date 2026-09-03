import classNames from 'classnames';
import style from './Line.module.scss';

interface LineProps {
  type: 'horizontal' | 'vertical';
}

const Line: React.FC<LineProps> = ({ type = 'horizontal' }) => {
  return (
    <div
      className={classNames(style.line, type === 'horizontal' ? style.line_h : style.line_v)}
    ></div>
  );
};

export default Line;
