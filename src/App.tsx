//画面構成（どのURLでどの画面を出すか）を記載

"use client";

import "./App.css";
import ActionChoice from "./pages/ActionChoice";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/action" element={<ActionChoice />} />
    </Routes>
  );
}
