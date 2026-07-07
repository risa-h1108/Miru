//振り返り画面
import { Link, useLocation } from "react-router-dom";

export default function Reflection() {
  const location = useLocation();
  const selectedAction = location.state?.selectedAction ?? "";
  const selectedDecision = location.state?.selectedDecision ?? null;
  //:string[]：[location.state]の型をTSが推測できないため明示。
  //　?? []（空配列）とすることで、値がない場合も型がstring[]のまま保たれる
  const selectedReasons: string[] = location.state?.selectedReasons ?? [];

  return (
    <div>
      <div className=" max-w-sm mx-auto mt-3 ">
        <h1 className="text-[24px] text-center">振り返り</h1>
        <h2 className="text-[16px] text-center">結果を記録しましょう</h2>
      </div>

      <div>
        <p>行動：{selectedAction}</p>
        {/*[true/false]で表示されるのを日本語の文字列に変換してから表示する */}
        <p>選択：{selectedDecision ? "やる" : "やらない"}</p>
        {/*.join(区切り文字)：配列の中身(selectedReasons)を指定した区切り文字(、)で繋げて、1本の文字列に変更する */}
        <p>理由：{selectedReasons.join("、")}</p>
      </div>

      <Link to="/analysis" />
    </div>
  );
}
