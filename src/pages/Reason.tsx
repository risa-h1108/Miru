//理由選択画面

import { Link } from "react-router-dom";
import type { Cards } from "../types";
import { Icon } from "@iconify/react";
import { useState } from "react";

//共通のCSS（カードの形やサイズ、カード内の位置）
const reasonCardsBase =
  "border border-gray-500 rounded-lg w-87 h-22 flex flex-col text-center text-lg";

// 理由カードの選択肢一覧
const reasonList: Cards[] = [
  { id: "tired", label: "疲れている", icon: "lucide:bed" },
  { id: "hassle", label: "面倒くさい", icon: "lucide:annoyed" },
  { id: "worried", label: "不安がある", icon: "fluent:thinking-20-regular" },
  { id: "no-time", label: "時間がない", icon: "lucide:alarm-clock-off" },
  {
    id: "priorities",
    label: "他のことを優先したい",
    icon: "lucide:briefcase",
  },
  { id: "question", label: "やり方が分からない", icon: "lucide:circle-help" },
  { id: "other", label: "その他", icon: "lucide:circle-ellipsis" },
];

export default function ReasonChoice() {
  // 選択中の理由を管理するstate
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  // 理由選択カードをクリックした時の処理
  const handleCardClick = (label: string) => {
    setSelectedReason(label); //stateに保存する
    console.log("clicked", label);
  };

  //「このカードが選ばれているか」の判定式：「selectedReasonに保存された”選択中のラベル”」と、「今mapが処理しているカードのラベル」が同じか確認。
  const getReasonCardsBg = (label: string) =>
    selectedReason === label
      ? "bg-blue-300" //一致(選択済み)の場合
      : "bg-blue-100 hover:bg-blue-200"; //不一致（未選択）の場合

  return (
    <div>
      <div className=" max-w-sm mx-auto mt-3 ">
        <h1 className="text-[24px] text-center">やらない理由は？</h1>
        <h2 className="text-[16px] text-center">
          当てはまるものを選んでください（複数選択OK）
        </h2>
      </div>

      <div>
        {reasonList.map((item) => (
          <div
            key={item.id}
            onClick={() => handleCardClick(item.label)} //カードと関数を繋げる
            className={`${reasonCardsBase} ${getReasonCardsBg(item.label)}`}
          >
            {/* アイコンの表示 */}
            <Icon icon={item.icon} width={40} height={40} />

            {/* ラベル（「勉強する」など）の表示 */}
            {item.label}
          </div>
        ))}
      </div>

      <Link to="/reflection" />
    </div>
  );
}
