//画面構成（どのURLでどの画面を出すか）を記載

"use client";

import "./App.css";
import ActionChoice from "./pages/ActionChoice";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Reflection from "./pages/Reflection";
import Analysis from "./pages/Analysis";
import ReasonsChoice from "./pages/Reason";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/action" element={<ActionChoice />} />
      <Route path="reason" element={<ReasonsChoice />} />
      <Route path="reflection" element={<Reflection />} />
      <Route path="analysis" element={<Analysis />} />
    </Routes>
  );
}
