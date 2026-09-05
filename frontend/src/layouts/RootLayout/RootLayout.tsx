import Alert from '../../components/Alert/Alert';
import { Outlet } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppDispatch';

export const RootLayout = () => {
  const alert = useAppSelector((state) => state.app.alert);

  return (
    <>
      <Alert alert={alert} />
      <Outlet />
    </>
  );
};
