import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import NorcoExecutiveSuite from "../norco-executive-suite.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NorcoExecutiveSuite />
  </React.StrictMode>
);
