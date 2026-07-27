//画面下部のタブバーの見た目

import { Icon } from "@iconify/react";
import type { Cards } from "../types";

//タブの枠内での位置調整CSS
const TabGridBase = "grid grid-cols-3 gap-4 px-6 mb-4 mt-3 max-w-sm mx-auto";

//タブの選択肢リスト
const TabList: Cards[] = [
  { id: "home", label: "ホーム", icon: "ic:sharp-home" },
  {
    id: "reflection",
    label: "振り返り",
    icon: "material-symbols:history-rounded",
  },
  { id: "analysis", label: "分析", icon: "codicon:graph" },
];

export default function TabBar() {
  return (
    <div className="">
      {/*タブの中身を表示*/}
      <div className={TabGridBase}>
        {/*map処理で3つのアイコンや文字を生成*/}
        {TabList.map((item) => (
          <button key={item.id}>
            {/*アイコンの表示*/}
            <Icon icon={item.icon} width={40} height={40} />

            {/*ラベル（「疲れている」など）の表示*/}
            {/*「ラベルの部分」と明確にしておくため、spanタグを記載*/}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
