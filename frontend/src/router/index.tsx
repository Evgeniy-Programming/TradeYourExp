import { createBrowserRouter } from 'react-router-dom';
import { MainPage } from '../pages/MainPage/MainPage';
import { requireAuth, requireGuest } from './loaders/authLoader';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
  },
  {
    path: '/login',
    element: <div>Login page</div>,
    loader: requireGuest,
  },
  {
    path: '/register',
    element: <div>Register page</div>,
    loader: requireGuest,
  },
  {
    loader: requireAuth,
    children: [
      {
        path: '/profile',
        element: <div>Profile page</div>,
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
