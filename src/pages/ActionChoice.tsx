import { Icon } from "@iconify/react";

export default function ActionChoice() {
  return (
    <div>
      <h1>今、何をやりたい？</h1>
      <h2>行動を選択してください</h2>

      {/*4つ全てを縦横2列ずつ・中央寄せ */}
      <div className="grid grid-cols-2 gap-3 px-12 mb-3 mt-3">
        {/* 各カードやテキストの位置、サイズ */}
        <div className="border border-gray-500 rounded-lg w-40 h-31.5 flex flex-col items-center justify-center">
          <Icon icon="lucide:book"></Icon>
          勉強する
        </div>
        <div className="border border-gray-500 rounded-lg w-40 h-31.5">
          運動する
        </div>
        <div className="border border-gray-500 rounded-lg w-40 h-31.5">
          掃除する
        </div>
        <div className="border border-gray-500 rounded-lg w-40 h-31.5">
          風呂入る
        </div>
      </div>

      <div className="border border-gray-500 rounded-lg w-40 h-31.5 mb-3 justify-center">
        その他
      </div>

      <h2>やる？やらない？</h2>

      <div className="border border-gray-500 rounded-lg">やる</div>
      <div className="border border-gray-500 rounded-lg">やらない</div>
    </div>
  );
}
