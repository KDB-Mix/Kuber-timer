import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { randomScrambleForEvent } from "cubing/scramble";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
