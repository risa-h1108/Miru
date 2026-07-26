//画面構成（どのURLでどの画面を出すか）を記載

import "./App.css";
import ActionChoice from "./pages/ActionChoice";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Reflection from "./pages/Reflection";
import Analysis from "./pages/Analysis";
import ReasonsChoice from "./pages/ReasonsChoice";
import LayoutWithTabBar from "./components/LayoutWithTabBar";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* 下記のページにて、タブバー付きの見た目にする */}
      <Route element={<LayoutWithTabBar />} />

      {/* 各ページ */}
      <Route path="/action" element={<ActionChoice />} />
      <Route path="reasons" element={<ReasonsChoice />} />
      <Route path="reflection" element={<Reflection />} />
      <Route path="analysis" element={<Analysis />} />
    </Routes>
  );
}
