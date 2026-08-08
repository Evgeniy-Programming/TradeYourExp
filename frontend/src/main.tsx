import { createRoot } from 'react-dom/client';
import './assets/styles/normalize.css';
import './assets/styles/initialize.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <h1>Home</h1>,
  },
]);

createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />);
