import style from './Alert.module.scss';
import type { IAlert } from './../../types/alert';
import classNames from 'classnames';
import ErrorSVG from '../../ui/svg/ErrorSVG';
import InformationSVG from '../../ui/svg/InformationSVG';
import WarningSVG from '../../ui/svg/WarningSVG';
import SuccessSVG from '../../ui/svg/SuccessSVG';
import Close from '../../ui/Close/Close';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { clearAlert } from '../../store/slices/appSlice';

interface AlertProps {
  alert: IAlert | null;
}

const Alert: React.FC<AlertProps> = ({ alert }) => {
  const dispatch = useAppDispatch();

  const closeAlert = () => {
    dispatch(clearAlert());
  };

  return (
    <div className={style.alert_block}>
      {alert && (
        <div
          className={classNames(style.alert, {
            [style.alert__info]: alert.type === 'info',
            [style.alert__error]: alert.type === 'error',
            [style.alert__warning]: alert.type === 'warning',
            [style.alert__success]: alert.type === 'success',
          })}
        >
          <div className={style.alert__close}>
            <Close onClick={closeAlert} color="var(--color-text-transparent)" />
          </div>

          {alert.type === 'error' && <ErrorSVG />}
          {alert.type === 'info' && <InformationSVG />}
          {alert.type === 'success' && <SuccessSVG />}
          {alert.type === 'warning' && <WarningSVG />}
          <p>{alert.message}</p>
        </div>
      )}
    </div>
  );
};

export default Alert;
