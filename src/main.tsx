//アプリ全体を動かすための土台・環境設定を記載

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* BrowserRouter：URLのパスに応じてルーティングするための仕組み */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
