import { createBrowserRouter } from 'react-router-dom';
import { MainPage } from '../pages/MainPage/MainPage';
import { requireAuth, requireGuest } from './loaders/authLoader';
import { LoginPage } from '../pages/LoginPage/LoginPage';
import { RegisterPage } from '../pages/RegisterPage/RegisterPage';
import { ProfilePage } from '../pages/ProfilePage/ProfilePage';
import { CreatorPage } from '../pages/CreatorPage/CreatorPage';
import { RootLayout } from '../layouts/RootLayout/RootLayout';
import { HistoryPage } from '../pages/HistoryPage/HistoryPage';
import { StatsPage } from '../pages/StatsPage/StatsPage';
import { ProfileViewPage } from '../pages/ProfileViewPage/ProfileViewPage';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
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
        path: '/profile/view/:profileId',
        element: <ProfileViewPage />,
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
            element: <StatsPage />,
          },
          {
            path: '/profile/history',
            element: <HistoryPage />,
          },
          {
            path: '/create',
            element: <CreatorPage />,
          },
        ],
      },
    ],
  },
]);
