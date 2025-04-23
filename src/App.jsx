import React, { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Start from './components/Start.jsx';
import Game from './components/Game.jsx';

const App = () => {
  const [playerInfo, setPlayerInfo] = useState(null);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Start setPlayerInfo={setPlayerInfo} />, // Passing setPlayerInfo as prop
    },
    {
      path: "/game",
      element: <Game playerInfo={playerInfo} />, // Passing playerInfo to Game component
    }
  ]);

  return <RouterProvider router={router} />;
};

export default App;
