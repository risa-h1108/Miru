//振り返り画面
import { Icon } from "@iconify/react";
import { Link, useLocation } from "react-router-dom";
import type { Result, ResultButton } from "../types";
import { useState } from "react";

//記録内容ボックスのCSS
const recordBase =
  "w-full max-w-sm mx-auto border border-gray-400 rounded-lg mt-6 p-4 text-xl space-y-1";

//画面上の3ボタンの位置調整CSS
const gridBase = "max-w-sm mx-auto grid grid-cols-3 gap-5 px-2 mb-4 mt-4 ";

//共通のCSS（カード型ボタンの形やサイズ、カード型ボタン内の配置）
const buttonCardsBase =
  "border rounded-lg w-28 h-36 flex flex-col items-center justify-center text-lg";

//結果の「良かった/普通/後悔」の3択ボタンのデータ一覧
const resultList: ResultButton[] = [
  {
    id: "good",
    label: "やってよかった",
    icon: "lucide:smile",
    bgBase: "bg-green-100 hover:bg-green-200",
    bgSelected: "bg-green-300",
    borderColor: "border-green-400",
    //SVGアイコンの色はSVGが「テキストカラーを継承する」設定になっていることが多いため、text-で指定する
    iconColor: "text-green-500",
  },
  {
    id: "neutral",
    label: "どちらでもない",
    icon: "lucide:annoyed",
    bgBase: "bg-amber-100 hover:bg-amber-200",
    bgSelected: "bg-amber-300",
    borderColor: "border-amber-400",
    iconColor: "text-amber-500",
  },
  {
    id: "regret",
    label: "やらなくて後悔",
    icon: "lucide:frown",
    bgBase: "bg-red-100 hover:bg-red-200",
    bgSelected: "bg-red-300",
    borderColor: "border-red-400",
    iconColor: "text-red-500",
  },
];

//メモのCSS
const memoBase =
  "w-full max-w-sm mx-auto h-36 rounded-lg border border-gray-300 ";

export default function Reflection() {
  //以下のlocation.state?.~は各データを前ページから取得する機能
  const location = useLocation();
  const selectedAction = location.state?.selectedAction ?? "";
  const selectedDecision = location.state?.selectedDecision ?? null;

  //:string[]：[location.state]の型をTSが推測できないため明示。
  //　?? []（空配列）とすることで、値がない場合も型がstring[]のまま保たれる
  const selectedReasons: string[] = location.state?.selectedReasons ?? [];

  //[全ての選択が確定した瞬間(in ReasonsChoice画面)の時間]をReasonsChoice画面から取得
  const recordedAt = location.state?.recordedAt ?? "";

  //選択中の結果(3ボタン、[良かった,普通,後悔,null])を管理するstate
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);

  //選択中の結果ボタンがボタンのid("good"など)と一致している場合、それぞれの選択色(bgSelected指定色)を表示する。
  //一致していない場合、未選択時の通常色(bgBase指定色)を表示する。
  //itemにはresultListがmap処理した1つ分のデータが渡される。
  const getResultBg = (item: ResultButton) =>
    selectedResult === item.id ? item.bgSelected : item.bgBase;

  return (
    <div>
      <div className=" max-w-sm mx-auto mt-3 ">
        <h1 className="text-[24px] text-center">振り返り</h1>
        <h2 className="text-[16px] text-center">結果を記録しましょう</h2>
      </div>

      {/*前のページで記録した内容を表示する部分*/}
      <div className={recordBase}>
        <p>行動：{selectedAction}</p>
        {/*[true/false]で表示されるのを日本語の文字列に変換してから表示する */}
        <p>選択：{selectedDecision ? "やる" : "やらない"}</p>
        {/* flex：「理由：」と値を横並びにする、shrink-0：ラベル部分(「理由：」)の幅を縮めさせない。
            flex + shrink-0 = ぶら下げインデント */}
        <div className="flex">
          <span className="shrink-0">理由：</span>
          {/*.join(区切り文字)：配列の中身(selectedReasons)を指定した区切り文字(、)で繋げて、1本の文字列に変更する */}
          <span>{selectedReasons.join("、")}</span>
        </div>
        <p>日時：{recordedAt}</p>
      </div>

      {/*記録した内容を評価する部分*/}
      <div>
        <div className=" max-w-sm mx-auto mt-8">
          <p className="text-[20px] pl-1">結果はどうでしたか？</p>
        </div>

        {/*カード全てを横1列に中央寄せ*/}
        <div className={gridBase}>
          {resultList.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedResult(item.id)}
              className={`${buttonCardsBase} ${getResultBg(item)} ${item.borderColor}`}
            >
              {/*アイコンの表示*/}
              <Icon
                icon={item.icon}
                width={50}
                height={50}
                className={`${item.iconColor} mb-2`}
              />

              {/*ラベル（「勉強する」など）の表示*/}
              {/*「ラベルの部分」と明確にしておくため、spanタグを記載*/}
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/*メモ欄*/}
        <h3 className="text-[16px] mb-3 px-2  max-w-sm mx-auto">
          メモ（任意）
        </h3>

        <div className={memoBase}>
          <p className="text-[16px] text-center pl-3 "></p>
        </div>
      </div>

      <Link to="/analysis" />
    </div>
  );
}
