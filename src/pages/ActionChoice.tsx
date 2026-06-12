import { Icon } from "@iconify/react";
import { useState } from "react";

export default function ActionChoice() {
  const [action, setAction] = useState([]);

  const Choice = () => {};

  return (
    <div>
      <div className=" max-w-sm mx-auto mt-3 ">
        <h1 className="text-[24px] flex items-center justify-center">
          今、何をやりたい？
        </h1>
        <h2 className="text-[16px] flex items-center justify-center">
          行動を選択してください
        </h2>
      </div>

      {/*4つ全てを縦横2列ずつ・中央寄せ */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 px-6 mb-4 mt-3 max-w-sm mx-auto">
        {/* 各カードやテキストの位置、サイズ */}
        <div className="border border-gray-500 rounded-lg w-40 h-31.5 flex flex-col items-center justify-center text-lg bg-emerald-100 hover:bg-emerald-200">
          <Icon icon="lucide:book" width={70} height={70}></Icon>
          勉強する
        </div>

        <div className="border border-gray-500 rounded-lg w-40 h-31.5 flex flex-col items-center justify-center bg-orange-100 hover:bg-orange-200">
          <Icon icon="lucide:dumbbell" width={70} height={70}></Icon>
          運動する
        </div>

        <div className="border border-gray-500 rounded-lg w-40 h-31.5 flex flex-col items-center justify-center  bg-fuchsia-100 hover:bg-fuchsia-200">
          <Icon icon="lucide-lab:broom" width={70} height={70}></Icon>
          掃除する
        </div>
        <div className="border border-gray-500 rounded-lg w-40 h-31.5 flex flex-col items-center justify-center bg-cyan-100 hover:bg-cyan-200">
          <Icon icon="lucide-lab:bath-bubble" width={70} height={70}></Icon>
          風呂入る
        </div>
      </div>

      <div className="border border-gray-500 rounded-lg w-40 h-31.5 mb-3 flex flex-col items-center justify-center mx-auto  bg-gray-100 hover:bg-gray-200">
        <Icon icon="lucide:ellipsis" width={70} height={70}></Icon>
        その他
      </div>

      <div className=" max-w-sm mx-auto mt-3">
        <h2 className="text-[24px] flex items-center justify-center">
          やる？やらない？
        </h2>
      </div>

      {/*横2列・中央寄せ */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 px-6 mb-4 mt-3 max-w-sm mx-auto">
        {/* 選択可能なカード表示 */}
        <div className="border border-gray-500 rounded-lg w-40 h-31.5 flex flex-col items-center justify-center bg-[#CBFFA9] hover:bg-[#b1ff7e]">
          <Icon icon="lucide:check" width={70} height={70}></Icon>
          やる
        </div>

        <div className="border border-gray-500 rounded-lg w-40 h-31.5 flex flex-col items-center justify-center bg-[#FF9B9B] hover:bg-[#fe7575]">
          <Icon icon="lucide:x" width={70} height={70}></Icon>
          やらない
        </div>
      </div>
    </div>
  );
}
