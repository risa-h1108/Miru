import { Icon } from "@iconify/react";
import { useState } from "react";

export default function ActionChoice() {
  const [action, setAction] = useState([]);

  const Choice = () => {};

  return (
    <div>
      <h1>今、何をやりたい？</h1>
      <h2>行動を選択してください</h2>

      {/*4つ全てを縦横2列ずつ・中央寄せ */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 px-6 mb-4 mt-3 max-w-sm mx-auto">
        {/* 各カードやテキストの位置、サイズ */}
        <div className="border border-gray-500 rounded-lg w-40 h-31.5 flex flex-col items-center justify-center text-lg">
          <Icon icon="lucide:book" width={70} height={70}></Icon>
          勉強する
        </div>

        <div className="border border-gray-500 rounded-lg w-40 h-31.5 flex flex-col items-center justify-center">
          <Icon icon="lucide:dumbbell" width={70} height={70}></Icon>
          運動する
        </div>

        <div className="border border-gray-500 rounded-lg w-40 h-31.5 flex flex-col items-center justify-center">
          <Icon icon="lucide-lab:broom" width={70} height={70}></Icon>
          掃除する
        </div>
        <div className="border border-gray-500 rounded-lg w-40 h-31.5 flex flex-col items-center justify-center">
          <Icon icon="lucide-lab:bath-bubble" width={70} height={70}></Icon>
          風呂入る
        </div>
      </div>

      <div className="border border-gray-500 rounded-lg w-40 h-31.5 mb-3 flex flex-col items-center justify-center mx-auto">
        <Icon icon="lucide:ellipsis" width={70} height={70}></Icon>
        その他
      </div>

      <h2>やる？やらない？</h2>

      {/*横2列・中央寄せ */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 px-6 mb-4 mt-3 max-w-sm mx-auto">
        {/* 選択可能なカード表示 */}
        <div className="border border-gray-500 rounded-lg w-40 h-31.5 flex flex-col items-center justify-center bg-[#B6FF6D]">
          <Icon icon="lucide:check" width={70} height={70}></Icon>
          やる
        </div>

        <div className="border border-gray-500 rounded-lg w-40 h-31.5 flex flex-col items-center justify-center bg-[#FFBFBF]">
          <Icon icon="lucide:x" width={70} height={70}></Icon>
          やらない
        </div>
      </div>
    </div>
  );
}
