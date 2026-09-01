import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainPage } from './pages/MainPage/MainPage';
import './assets/styles/normalize.css';
import './assets/styles/initialize.css';
import { Provider } from 'react-redux';
import { store } from './store';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
  },
]);

createRoot(document.getElementById('root')!).render(<Provider store={store}>
  <RouterProvider router={router} />
</Provider>);
