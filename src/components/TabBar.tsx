//画面下部のタブバーの見た目

import { Icon } from "@iconify/react";
import type { TabCards } from "../types";
import { useLocation, useNavigate } from "react-router-dom";

//タブの枠内での位置調整CSS
const TabGridBase = "grid grid-cols-3 gap-4 px-6 mb-4 mt-8 max-w-sm mx-auto";

//タブの選択肢リスト
const TabList: TabCards[] = [
  {
    id: "action",
    label: "行動",
    icon: "material-symbols:directions-walk",
    url: "/action",
  },
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

  const location = useLocation();
  //現在の表示ページ(location.pathname)とタブの遷移先url(引数)が一致しているか(＝どのタブを今選択中か)を判定する条件式
  const isActive = (url: string) => location.pathname === url;

  return (
    <div className="fixed bottom-0 w-full bg-white">
      {/*タブの中身を表示*/}
      <div className={TabGridBase}>
        {/*map処理で3つのタブ選択肢を生成*/}
        {TabList.map((item) => {
          const active = isActive(item.url);
          return (
            <button
              key={item.id}
              //タブが表示される瞬間（レンダリング時）にnavigateが実施されてページ遷移を起こさないために、
              //アロー関数[()=>]で包んで「まだ実行しない関数」の形にしておく
              onClick={() => navigate(item.url)}
              //buttonタブ内をflexで縦方向（flex-col）に並べ、items-centerで横方向の中央も揃える
              className="flex flex-col items-center"
            >
              {/*アイコンの表示*/}
              <Icon
                icon={item.icon}
                width={36}
                height={36}
                className={active ? "text-gray-600" : "text-gray-400"}
              />

              {/*ラベル（「ホーム」など）の表示*/}
              <span className={active ? "text-gray-600" : "text-gray-400"}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
