import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Start from './components/Start';
import Game from './components/Game';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Start />,
  },
  {
    path: '/game',
    element: <Game />,
  },
]);

const App = () => <RouterProvider router={router} />;
export default App;