//行動選択画面

import { Icon } from "@iconify/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { Cards } from "../types";

//画面上のカードの位置調整CSS
const gridBase =
  "grid grid-cols-2 gap-x-4 gap-y-4 px-6 mb-4 mt-3 max-w-sm mx-auto";

//共通のCSS（カードの形やサイズ、カード内の位置）
const cardBase =
  "border border-gray-500 rounded-lg w-40 h-31.5 flex flex-col items-center justify-center text-lg";

// 行動カードのデータ一覧(オブジェクトの配列にすることで、カードの追加・削除が配列の編集だけで済む)
// 毎回レンダリングされても変わらないデータのため、コンポーネントの外に置く
const actionList: Cards[] = [
  { id: "study", label: "勉強する", icon: "lucide:book" },
  { id: "workout", label: "運動する", icon: "lucide:dumbbell" },
  { id: "clean", label: "掃除する", icon: "lucide-lab:broom" },
  { id: "bath", label: "風呂入る", icon: "lucide-lab:bath-bubble" },
];

export default function ActionChoice() {
  // 選択中の行動を管理するstate
  //null：「ない」と、明確に記載した状態（意図的に「空」と指定）
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  // やる・やらないの選択を管理するstate
  const [selectedDecision, setSelectedDecision] = useState<boolean | null>(
    null,
  );

  // 行動カードをクリックした時の処理
  //1.labelでカードのどれかを受け取る、という関数
  const handleCardClick = (label: string) => {
    setSelectedAction(label); //2.stateに保存する
    //   console.log("clicked", label);
  };

  //やる・やらないのどちらかをクリックした時の処理
  //選択したActionカードと真偽（やる・やらない）をlogで出力
  const handleDecision = (decision: boolean) => {
    setSelectedDecision(decision);
    console.log({ action: selectedAction, decision });
  };

  //「このカードが選ばれているか」の判定式：「selectedActionに保存された”選択中のラベル”」と、「今mapが処理しているカードのラベル」が同じか確認。
  const getCardBg = (label: string) =>
    selectedAction === label
      ? "bg-gray-300" //一致(選択済み)の場合
      : "bg-gray-100 hover:bg-gray-200"; //不一致（未選択）の場合

  return (
    <div>
      <div className=" max-w-sm mx-auto mt-3 ">
        <h1 className="text-[24px] text-center">今、何をやりたい？</h1>
        <h2 className="text-[16px] text-center">行動を選択してください</h2>
      </div>

      {/*4カード全てを縦横2列ずつ・中央寄せ */}
      <div className={gridBase}>
        {/* actionListの配列をmapで回して4枚のカードを生成。
    onClickでクリックされたカードのラベルをuseStateに保存。カードのCSSを表示。 */}
        {actionList.map((item) => (
          <div
            key={item.id}
            onClick={() => handleCardClick(item.label)} //3.カードと関数を繋げる
            className={`${cardBase} ${getCardBg(item.label)}`}
          >
            {/* アイコンの表示 */}
            <Icon icon={item.icon} width={70} height={70} />

            {/* ラベル（「勉強する」など）の表示 */}
            {/* 「ラベルの部分」と明確にしておくため、spanタグを記載 */}
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* その他カード：1枚だけ中央に表示 */}
      <div
        onClick={() => handleCardClick("その他")}
        className={`${cardBase} mx-auto ${getCardBg("その他")}`}
      >
        <Icon icon="lucide:ellipsis" width={70} height={70} />
        その他
      </div>

      {/* やる？やらない？エリア */}
      <div className=" max-w-sm mx-auto mt-3">
        <h2 className="text-[24px] text-center">やる？やらない？</h2>
      </div>

      {/*やる・やらないボタン:横2列・中央寄せ */}
      <div className={gridBase}>
        {/* 「やる」ボタンの表示 */}
        <Link
          to="/reason"
          onClick={() => handleDecision(true)}
          className={`${cardBase} ${
            selectedDecision === true
              ? "bg-[#b1ff7e] " //一致(選択済み)の場合
              : "bg-[#CBFFA9] hover:bg-[#b1ff7e]" //不一致（未選択）の場合
          }`}
        >
          <Icon icon="lucide:check" width={70} height={70}></Icon>
          やる
        </Link>

        {/* 「やらない」ボタンの表示 */}
        <Link
          to="/reason"
          onClick={() => handleDecision(false)}
          className={`${cardBase} ${
            selectedDecision === false
              ? "bg-[#fe7575]" //一致(選択済み)の場合
              : "bg-[#FF9B9B] hover:bg-[#fe7575]" //不一致（未選択）の場合
          }`}
        >
          <Icon icon="lucide:x" width={70} height={70}></Icon>
          やらない
        </Link>
      </div>
    </div>
  );
}
