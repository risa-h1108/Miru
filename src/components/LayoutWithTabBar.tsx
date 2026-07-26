//ページの中身(Outlet＝各ページ)とTabBarを「組み合わせる」ためのコンポーネント

import { Outlet } from "react-router-dom";
import TabBar from "./TabBar";

export default function LayoutWithTabBar() {
  return (
    <div>
      <Outlet /> {/* ページの中身（ActionChoiceやReflectionなど） */}
      <TabBar /> {/* 部品としてのタブバー */}
    </div>
  );
}
