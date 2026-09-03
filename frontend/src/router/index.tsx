import { createBrowserRouter } from 'react-router-dom';
import { MainPage } from '../pages/MainPage/MainPage';
import { requireAuth, requireGuest } from './loaders/authLoader';
import { LoginPage } from '../pages/LoginPage/LoginPage';
import { RegisterPage } from '../pages/RegisterPage/RegisterPage';
import { ProfilePage } from '../pages/ProfilePage/ProfilePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
    loader: requireGuest,
  },
  {
    path: '/register',
    element: <RegisterPage />,
    loader: requireGuest,
  },
  {
    loader: requireAuth,
    children: [
      {
        path: '/profile',
        element: <ProfilePage />,
      },
      {
        path: '/profile/stats',
        element: <div>Profile Stats page</div>,
      },
      {
        path: '/profile/history',
        element: <div>Profile History page</div>,
      },
      {
        path: '/create',
        element: <div>Creator page</div>,
      },
    ],
  },
]);
