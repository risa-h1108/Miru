//振り返り画面
import { Link, useLocation } from "react-router-dom";

//記録内容ボックスのCSS
const recordBase =
  "w-full max-w-sm mx-auto border border-gray-400 rounded-lg mt-6 p-5 text-xl space-y-1";

export default function Reflection() {
  const location = useLocation();
  const selectedAction = location.state?.selectedAction ?? "";
  const selectedDecision = location.state?.selectedDecision ?? null;

  //:string[]：[location.state]の型をTSが推測できないため明示。
  //　?? []（空配列）とすることで、値がない場合も型がstring[]のまま保たれる
  const selectedReasons: string[] = location.state?.selectedReasons ?? [];

  //[全ての選択が確定した瞬間(in ReasonsChoice画面)の時間]をReasonsChoice画面から取得
  const recordedAt = location.state?.recordedAt ?? "";

  return (
    <div>
      <div className=" max-w-sm mx-auto mt-3 ">
        <h1 className="text-[24px] text-center">振り返り</h1>
        <h2 className="text-[16px] text-center">結果を記録しましょう</h2>
      </div>

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

      <Link to="/analysis" />
    </div>
  );
}
