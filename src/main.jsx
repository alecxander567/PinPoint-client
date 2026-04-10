import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ReportCountProvider } from "./components/ReportCountProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ReportCountProvider>
      <App />
    </ReportCountProvider>
  </StrictMode>,
);
