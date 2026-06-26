//理由選択画面
"use client";

import { Link } from "react-router-dom";
import type { Cards } from "../types";
import { Icon } from "@iconify/react";
import { useState } from "react";

//画面上のカードの位置調整CSS
const reasonGridBase = "grid gap-x-4 gap-y-4 px-6 mb-4 mt-3 max-w-sm mx-auto";

//共通のCSS（カードの形やサイズ、カード内の位置）
//w-full:親要素の幅いっぱい広がる、pl:padding-leftの略（内側の余白-左、アイコンの左余白）
//gap:子要素全部の間に隙間を作る(今回はアイコンとラベルしか子要素ないから、その間に隙間ができる)
const reasonCardsBase =
  "border border-gray-500 rounded-lg w-full h-12 flex items-center pl-3 gap-5 text-xl";

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
  //※単一選択なので、複数選択に変える
  const getReasonCardsBg = (label: string) =>
    selectedReason === label
      ? "bg-blue-300" //一致(選択済み)の場合
      : "hover:bg-blue-200"; //不一致（未選択）の場合

  return (
    <div>
      <div className=" max-w-sm mx-auto mt-3 ">
        <h1 className="text-[24px] text-center">やらない理由は？</h1>
        <h2 className="text-[16px] text-center">
          当てはまるものを選んでください（複数選択OK）
        </h2>
      </div>

      {/* 理由選択カードの表示 */}
      <div className={reasonGridBase}>
        {/* map処理で7つのカードを生成 */}
        {reasonList.map((item) => (
          <div
            key={item.id}
            onClick={() => handleCardClick(item.label)} //カードと関数を繋げる
            className={`${reasonCardsBase} ${getReasonCardsBg(item.label)}`}
          >
            {/* アイコンの表示 */}
            <Icon icon={item.icon} width={40} height={40} />

            {/* ラベル（「疲れている」など）の表示 残りのスペースを全部もらい、その中で中央寄せにする */}

            <span className="flex items-center">{item.label}</span>
          </div>
        ))}
      </div>

      <Link to="/reflection" />
    </div>
  );
}
