import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainPage } from './pages/MainPage/MainPage';
import './assets/styles/normalize.css';
import './assets/styles/initialize.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
  },
]);

createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />);
