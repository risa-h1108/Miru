//行動選択、理由選択画面にある選択肢カードの型
export type Cards = { id: string; label: string; icon: string };

//TabListで使用する型
export type TabCards = { id: string; label: string; icon: string; url: string };

//1連の「行動、理由、振り返り」の記録全体の型
export type Decision = {
  id: string; //カードを1枚ずつ区別する為の番号
  actionName: string; //どの行動についての決定か（ex「勉強する」）
  decision: boolean; //「やる（true）」か「やらない（false）」かの記録
  reasons: string[]; //「なぜその行動を選んだか」の理由ID（文字列の配列）。複数選択のため[]を追加
  result: Result; //Resultで定義した3択のみ記録できる
  memo: string; //自由記述欄
  //createdAt：データをやり取りする形式がJSONのsupabaseを利用するため、文字列として定義
  createdAt: string; //記録が作成された日時（ISO文字列）
};

//result専用の型定義、「良かった/普通/後悔」の3択から選択できるリスト
export type Result = "good" | "neutral" | "regret";

//「良かった/普通/後悔」の3択ボタンを表示させるために必要なデータの型
export type ResultButton = {
  id: Result; //既存のResult型を利用
  label: string;
  icon: string;
  bgBase: string; //未選択時の背景色
  bgSelected: string; //選択時の背景色
  borderColor: string; //枠線の色
  iconColor: string; //アイコンの色
};

//[行動選択、理由選択まで]の1件分の選択記録データの型
export type UnfinishedRecord = {
  selectedAction: string;
  selectedDecision: boolean | null;
  selectedReasons: string[];
  recordedAt: string; //記録が作成された日時（ISO文字列）
};

//1件分の選択後の記録データの型
export type SaveRecord = {
  selectedAction: string;
  selectedDecision: boolean | null;
  selectedReasons: string[];
  recordedAt: string; //記録が作成された日時（ISO文字列）
  selectedResult: Result | null;
  memo: string;
};
