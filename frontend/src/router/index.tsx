import { createBrowserRouter } from 'react-router-dom';
import { MainPage } from '../pages/MainPage/MainPage';
import { loadProfile, requireAuth, requireGuest } from './loaders/authLoader';
import { LoginPage } from '../pages/LoginPage/LoginPage';
import { RegisterPage } from '../pages/RegisterPage/RegisterPage';
import { ProfilePage } from '../pages/ProfilePage/ProfilePage';
import { CreatorPage } from '../pages/CreatorPage/CreatorPage';
import { RootLayout } from '../layouts/RootLayout/RootLayout';
import { HistoryPage } from '../pages/HistoryPage/HistoryPage';
import { StatsPage } from '../pages/StatsPage/StatsPage';
import { ProfileViewPage } from '../pages/ProfileViewPage/ProfileViewPage';
import { ReviewsPage } from '../pages/ReviewsPage/ReviewsPage';
import { ReviewsViewPage } from '../pages/ReviewsViewPage/ReviewsViewPage';
import { HistoryViewPage } from '../pages/HistoryViewPage/HistoryViewPage';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    loader: loadProfile,
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
            path: '/profile/reviews',
            element: <ReviewsPage />,
          },
          {
            path: '/profile/view/:username',
            element: <ProfileViewPage />,
          },
          {
            path: '/profile/history/view/:username',
            element: <HistoryViewPage />,
          },
          {
            path: '/profile/reviews/view/:username',
            element: <ReviewsViewPage />,
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
