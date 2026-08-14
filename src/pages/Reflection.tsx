//振り返り画面
import { Icon } from "@iconify/react";
import { useLocation, useNavigate } from "react-router-dom";
import type {
  Result,
  ResultButton,
  SaveRecord,
  UnfinishedRecord,
} from "../types";
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
  " block w-full max-w-sm mx-auto h-36 rounded-lg border border-gray-300 ";

//保存ボタンのCSS
const saveButtonBase =
  "border bg-blue-400 text-white rounded-lg mt-6 w-full max-w-sm mx-auto h-12 flex items-center justify-center text-2xl";

export default function Reflection() {
  //以下のlocation.state?.~は各データを前ページから取得する機能
  const location = useLocation();

  //localStorageに保存されている[未振り返りの(＝行動、理由選択まで保存している)]記録一覧を取得
  //振り返り済みの記録("records")とキーが被らないよう、未振り返り記録の専用キー名"unfinishedRecords"を使用
  const unfinishedRecords: UnfinishedRecord[] = JSON.parse(
    localStorage.getItem("unfinishedRecords") ?? "[]",
  );

  //location.state(前ページから渡されたデータ)があればそれを使い、
  //なければlocalStorageに保存されているデータ(＝未振り返り記録)の最新1件を使う
  const record = location.state ?? unfinishedRecords.at(-1);

  const selectedAction = record?.selectedAction ?? "";
  const selectedDecision = record?.selectedDecision ?? null;

  //:string[]：[location.state]の型をTSが推測できないため明示。
  //　?? []（空配列）とすることで、値がない場合も型がstring[]のまま保たれる
  const selectedReasons: string[] = record?.selectedReasons ?? [];

  //[全ての選択が確定した瞬間(in ReasonsChoice画面)の時間]をReasonsChoice画面から取得
  const recordedAt = record?.recordedAt ?? "";

  //選択中の結果(3ボタン、[良かった,普通,後悔,null])を管理するstate
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);

  //選択中の結果ボタンがボタンのid("good"など)と一致している場合、それぞれの選択色(bgSelected指定色)を表示する。
  //一致していない場合、未選択時の通常色(bgBase指定色)を表示する。
  //itemにはresultListがmap処理した1つ分のデータが渡される。
  const getResultBg = (item: ResultButton) =>
    selectedResult === item.id ? item.bgSelected : item.bgBase;

  //入力中のメモを管理するstate
  const [memo, setMemo] = useState("");

  const navigate = useNavigate();

  //「保存する」ボタンが押された時の処理
  const saveDecision = () => {
    //1件分の記録データ(前画面から受け取ったもの＋この画面で入力したselectedResultとmemo)をまとめる
    const record: SaveRecord = {
      selectedAction,
      selectedDecision,
      selectedReasons,
      recordedAt,
      selectedResult,
      memo,
    };

    //localStorageにすでに保存されている記録一覧(records)を取得（データがなければ空配列[]を返す）
    //JSON.parse()：文字列になっているJSONデータを、実際のJavaScriptの配列やオブジェクトに戻す
    //localStorage.getItem("records"):recordsという名前で保存されているデータを取り出す
    const existingRecords: SaveRecord[] = JSON.parse(
      localStorage.getItem("records") ?? "[]",
    );

    //今回の記録(record)を[既存の配列の中身(他の記録データ)]の末尾に追加して、再度保存する
    const updatedRecords = [...existingRecords, record];
    //localStorage.setItem("records", ...)：updatedRecords(配列)を、[localStorageに保存できる文字列に変換した結果]を、recordsという名前で保存する
    //JSON.stringify()：JavaScriptの配列やオブジェクトを、localStorageに保存できる文字列に変換
    //振り返り済みの記録一覧を保存（未振り返り一覧とキー名が被らないよう、振り返り済みの専用キー"records"に統一）
    localStorage.setItem("records", JSON.stringify(updatedRecords));

    //unfinishedRecords(未振り返り一覧)から、今回振り返った1件を取り除く
    //.filter()：条件がtrue(条件通り)のものだけを残し、false(条件と異なる)のものは残さない(＝取り除く)処理
    //「item.recordedAt(＝未振り返り一覧の中の1件) !== record.recordedAt(＝今回振り返り終えた記録)(一致していない＝別のレコード＝今回のtrue)」だけ残るため、
    //一致するもの(＝今回振り返り終えたレコードそのもの)だけが結果的に取り除かれる
    const remainingUnfinished = unfinishedRecords.filter(
      (item) => item.recordedAt !== record.recordedAt,
    );

    //未振り返りの記録一覧を保存（"records"と同じキーにすると上書きされるため、未振り返り記録の専用別キー"unfinishedRecords"を使用）
    localStorage.setItem(
      "unfinishedRecords",
      JSON.stringify(remainingUnfinished),
    );

    navigate("/action");
  };

  //record(前ページから渡されたデータor未振り返り記録)があるなら、[?以降の(ここを表示)]、
  //recordがないなら、[:以降の(ここを表示)]
  return record ? (
    <div>
      <div className="max-w-sm mx-auto mt-3">
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
        <div className="max-w-sm mx-auto mt-8">
          <p className="text-[20px] pl-1">結果はどうでしたか？</p>
        </div>

        {/*カード全てを横1列に中央寄せ*/}
        <div className={gridBase}>
          {resultList.map((item) => (
            <button
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
            </button>
          ))}
        </div>

        {/*メモ欄*/}
        <h3 className="text-[16px] mb-3 px-2  max-w-sm mx-auto">
          メモ（任意）
        </h3>

        {/*メモ欄のテキストエリア*/}
        <textarea
          //value：メモ欄が今保持している文字列の値
          value={memo}
          //onChange：メモ欄の中身が変わったときに実行される処理
          //｛｝の中身：ユーザーがテキストを入力する度に、その最新の文字列(e.target.value)をsetMemoでstate更新する処理
          //e：入力内容の情報が入ったオブジェクト
          //e.target：イベントが発生したtextareaのこと
          //e.target.value：そのtextareaに、今実際に入力されている文字列
          onChange={(e) => setMemo(e.target.value)}
          placeholder="気づいたことをメモできます"
          className={`${memoBase} p-3 text-[16px]`}
        />
      </div>

      {/*保存ボタン*/}
      <button onClick={saveDecision} className={saveButtonBase}>
        保存する
      </button>
    </div>
  ) : (
    //min-h-screen:画面の高さいっぱいまで広がる
    //flexとmax-w-smが同じ要素に効いてしまい、意図通りの見た目にならない可能性がある為、divとpタグで分けて対応
    <div className="min-h-screen flex items-center justify-center">
      <p className="max-w-sm mx-auto text-center text-4xl text-black">
        振り返るデータがありません
      </p>
    </div>
  );
}
