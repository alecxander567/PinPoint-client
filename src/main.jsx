import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ReportCountProvider } from "./components/ReportCountProvider";
import { ItemCountProvider } from "./components/CountProviderItem.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ReportCountProvider>
      <ItemCountProvider>
        <App />
      </ItemCountProvider>
    </ReportCountProvider>
  </StrictMode>,
);
