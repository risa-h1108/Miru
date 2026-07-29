//画面下部のタブバーの見た目

import { Icon } from "@iconify/react";
import type { TabCards } from "../types";
import { useNavigate } from "react-router-dom";

//タブの枠内での位置調整CSS
const TabGridBase = "grid grid-cols-3 gap-4 px-6 mb-4 mt-8 max-w-sm mx-auto";

//タブの選択肢リスト
const TabList: TabCards[] = [
  { id: "home", label: "ホーム", icon: "ic:sharp-home", url: "/" },
  {
    id: "reflection",
    label: "振り返り",
    icon: "material-symbols:history-rounded",
    url: "/reflection",
  },
  { id: "analysis", label: "分析", icon: "codicon:graph", url: "/analysis" },
];

export default function TabBar() {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 w-full bg-white">
      {/*タブの中身を表示*/}
      <div className={TabGridBase}>
        {/*map処理で3つのタブ選択肢を生成*/}
        {TabList.map((item) => (
          <button
            key={item.id}
            //タブが表示される瞬間（レンダリング時）にnavigateが実施されてページ遷移を起こさないために、
            //アロー関数[()=>]で包んで「まだ実行しない関数」の形にしておく
            onClick={() => navigate(item.url)}
            //buttonタブ内をflexで縦方向（flex-col）に並べ、items-centerで横方向の中央も揃える
            className="flex flex-col items-center"
          >
            {/*アイコンの表示*/}
            <Icon icon={item.icon} width={36} height={36} />

            {/*ラベル（「ホーム」など）の表示*/}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
