import { Icon } from "@iconify/react";
import { useState } from "react";

export default function ActionChoice() {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  //1.labelでカードのどれかを受け取る、という関数
  const handleCardClick = (label: string) => {
    setSelectedAction(label); //2.stateに保存する
    console.log("clicked", label);
  };

  //const Button = ({ isActive }) => {};

  // 行動カードのデータ一覧(オブジェクトの配列にすることで、カードの追加・削除が配列の編集だけで済む)
  const actionList = [
    { id: "study", label: "勉強する", icon: "lucide:book" },
    { id: "workout", label: "運動する", icon: "lucide:dumbbell" },
    { id: "clean", label: "掃除する", icon: "lucide-lab:broom" },
    { id: "bath", label: "風呂入る", icon: "lucide-lab:bath-bubble" },
  ];

  return (
    <div>
      <div className=" max-w-sm mx-auto mt-3 ">
        <h1 className="text-[24px] text-center">今、何をやりたい？</h1>
        <h2 className="text-[16px] text-center">行動を選択してください</h2>
      </div>

      {/*4カード全てを縦横2列ずつ・中央寄せ */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 px-6 mb-4 mt-3 max-w-sm mx-auto">
        {/* actionListの配列をmapで回して4枚のカードを生成。
    onClickでクリックされたカードのラベルをuseStateに保存。カードのCSSを表示。 */}
        {actionList.map((item) => (
          <div
            key={item.id}
            onClick={() => handleCardClick(item.label)} //3.カードと関数を繋げる
            className={`border border-gray-500 rounded-lg w-40 h-31.5 flex flex-col items-center justify-center text-lg ${
        //      isActive ? " bg-gray-100 hover:bg-gray-200" : "bg-gray-200"
            }`}
          >
            {/* アイコンの表示 */}
            <Icon icon={item.icon} width={70} height={70} />

            {/* ラベル（「勉強する」など）の表示 */}
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* その他　の表示 */}
      <div
        onClick={() => handleCardClick("その他")}
        className="border border-gray-500 rounded-lg w-40 h-31.5 mb-3 flex flex-col items-center justify-center mx-auto  bg-gray-100 hover:bg-gray-200"
      >
        <Icon icon="lucide:ellipsis" width={70} height={70} />
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
