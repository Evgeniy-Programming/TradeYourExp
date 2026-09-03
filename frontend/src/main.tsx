import { createRoot } from 'react-dom/client';
import './assets/styles/normalize.css';
import './assets/styles/initialize.css';
import { Provider } from 'react-redux';
import { store } from './store';
import { router } from './router';
import { RouterProvider } from 'react-router';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
