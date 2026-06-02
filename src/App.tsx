"use client";

import "./App.css";
import { BrowserRouter } from "react-router-dom";

export default function App() {
  const router = BrowserRouter();
  const nextHandle = () => {
    router.push("/actionChoice");
  };

  return (
    <div>
      <button onClick={nextHandle}>ダッシュボードへ移動</button>
      Miru
    </div>
  );
}
