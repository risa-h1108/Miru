//行動選択画面で選ぶカードの型
export type Action = { id: string; label: string; icon: string };

//1連の「行動、理由、振り返り」の記録全体の型
export type Decision = {
  id: string; //カードを1枚ずつ区別する為の番号
  actionName: string; //どの行動についての決定か（ex「勉強する」）
  decision: boolean; //「やる（true）」か「やらない（false）」かの記録
  reason: string[]; //「なぜその行動を選んだか」の理由。複数選択のため[]を追加
  result: Result; //Resultで定義した3択のみ記録できる
  memo: string; //自由記述欄
  //createdAt：データをやり取りする形式がJSONのsupabaseを利用するため、文字列として定義
  createdAt: string; //記録が作成された日時（ISO文字列）
};

//result専用の型定義、「良かった/普通/後悔」の3択から選択できるリスト
type Result = "good" | "neutral" | "regret";
