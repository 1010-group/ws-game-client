import React from "react";
import { Outlet } from "react-router-dom";

const App = () => (
  <div>
    {/* Shared layout, e.g., navbar */}
    <Outlet /> {/* Renders child routes */}
  </div>
);

export default App;