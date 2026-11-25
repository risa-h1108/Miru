//ページの中身(Outlet＝各ページ)とヘッダー、TabBarを「組み合わせる」ためのコンポーネント

import { Outlet } from "react-router-dom";
import TabBar from "./TabBar";
import Header from "./Header";

export default function AppLayout() {
  return (
    //pbの空白の上にタブバーが重なる形になり、[次へ/保存]ボタンとタブバーが重ならない為に追加
    <div className="pb-30 px-6">
      <Header showBackLink={false} />
      <Outlet /> {/* ページの中身（ActionChoiceやReflectionなど） */}
      {/* 部品としてのタブバー、fixedで外側divとは無関係に画面下に浮かせている */}
      <TabBar />
    </div>
  );
}
