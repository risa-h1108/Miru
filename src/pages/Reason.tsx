//理由選択画面

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
  "border border-gray-500 rounded-lg w-full h-12 flex items-center pl-5 gap-6 text-xl";

// 気づきボックスのCSS
const tipBoxBase =
  "max-w-sm mx-auto h-36 mt-6 rounded-lg border border-amber-300 bg-amber-100";

// 次へ(確定)ボタンのCSS
const submitButtonBase =
  "border bg-blue-400 text-white rounded-lg mt-6 max-w-sm mx-auto h-12 flex items-center justify-center text-2xl";

// 理由カードの選択肢一覧
const reasonsList: Cards[] = [
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

export default function ReasonsChoice() {
  // 選択中の理由ラベルを管理するstate
  //useState<string[]>()：<型：string型が複数>（初期値：空の配列[]、配列は存在しているが中身は0個）
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);

  // 理由選択カードを「クリック＆削除」した時の処理(複数選択OK)
  const handleCardsClick = (label: string) => {
    setSelectedReasons(
      (
        prev, //prev:更新する前の「今の配列」の中身
      ) =>
        //[「今の配列」の中(=prev)]にlabelが[含まれているか(=includes)]を質問,true/falseのどちらかで回答
        prev.includes(label)
          ? //true(labelカードが既に選択されている)、既存と今クリックされたlabelが同じならそのlabelを「削除」する処理。
            // 詳細：[今クリックされたlabel]と[既に配列に入っている選択済みのselected]を比較して、一致してない場合、[クリックされたlabel]と違うものだけ残す。
            prev.filter((selected) => selected !== label)
          : //false(labelカードが選択されていない)、今クリックされたlabelを「追加」して、新しい配列を作る処理。
            //詳細： prevの中身を[全部そのまま残して(＝...)]、最後に[labelを1つ追加した(=,label)]、新しい配列を作る
            // ex ["疲れている", "面倒くさい", label]
            [...prev, label],
    );
    //  console.log("clicked", label);
  };

  //「どのカードが選ばれているか」の判定式
  const getReasonCardsBg = (label: string) =>
    //selectedReasonsの配列内に今選択したlabelが入っているか(複数OK)判定。
    selectedReasons.includes(label)
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
        {reasonsList.map((item) => (
          <div
            key={item.id}
            onClick={() => handleCardsClick(item.label)} //カードと関数を繋げる
            className={`${reasonCardsBase} ${getReasonCardsBg(item.label)}`}
          >
            {/* アイコンの表示 */}
            <Icon icon={item.icon} width={40} height={40} />

            {/* ラベル（「疲れている」など）の表示*/}
            {/* 「ラベルの部分」と明確にしておくため、spanタグを記載 */}
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* 気づきボックス */}
      <div className={tipBoxBase}>
        {/* px: padding-left + padding-right の略
        justify-center:Flexboxの「主軸（基本は横方向）」に沿って中央寄せ
        items-center:Flexboxの「交差軸（基本は縦方向）」に沿って中央寄せ */}
        <h3 className="text-[20px]  mt-3 mb-3 px-4 flex items-center justify-center">
          <Icon icon={"lucide:lightbulb"} width={25} height={25} />
          ちょっとした気づき
        </h3>
        <p className="text-[16px] text-center px-5 ">
          「疲れている」を理由にやらなかったときは、
          <br />
          後悔しやすい傾向があります。
          <br />
          5分だけやる、など小さく始めて見ませんか？
        </p>
      </div>

      {/* 次へ行くボタン */}
      <Link to="/reflection" className={submitButtonBase}>
        次へ
      </Link>
    </div>
  );
}
