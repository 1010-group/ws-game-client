import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import "./index.css";
import { store, persistor } from "./redux/store";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Start from "./components/Start";
import Game from "./components/Game";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.player.name);
  return user ? children : <Navigate to="/login" />;
};

// Routes config
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Start />
      </ProtectedRoute>
    ),
  },
  {
    path: "/game",
    element: (
      <ProtectedRoute>
        <Game />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);