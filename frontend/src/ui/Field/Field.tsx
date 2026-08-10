import classNames from 'classnames';
import { Field as FieldFormik } from 'formik';

import style from './Field.module.scss';

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isMaxWidth?: boolean;
}

const Field: React.FC<FieldProps> = ({ isMaxWidth = false, ...rest }) => {
  return (
    <FieldFormik
      component="input"
      className={classNames(style.input, isMaxWidth ? 'max-width' : '')}
      {...rest}
    />
  );
};

export default Field;
