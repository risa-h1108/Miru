import type { Decision } from "../types";

//localStorageにデータ保存する用のキー名（STORAGE_KEY）を設定
// "decisions"：新しく作った文字列で何も参照していない
const STORAGE_KEY = "decisions";

/// localStorageに保存されている「行動、理由、振り返り」の記録を「全部取得」する
export function getDecisions(): Decision[] {
  //キー名：「STORAGE_KEY＝"decisions"」を使用して、localStorageに保存されている値を取り出す処理
  //getItem():localStorageから()内に適したデータを取得するメソッド
  //  └返り値：「文字列」か「null」のどちらかのみ
  const json = localStorage.getItem(STORAGE_KEY);

  //何のデータも保存されていない場合の処理
  // jsonがnull（または空文字列）だったら、空の配列[]を返す
  if (!json) {
    return [];
  }

  //保存されているデータがある場合の処理
  //JSON.parse()：localStorageから取り出した「文字列」のデータを、元の形（配列やオブジェクト）に変換
  // └返り値が「any型」のため、型アノテーション（:）では型チェックが素通りするので、
  //  型アサーション（as）でDecision[]の形と明記。
  return JSON.parse(json) as Decision[];
}

//localStorageに保存されている「行動、理由、振り返り」の記録を、複数件をまとめて「全部上書き」保存する
//decisionList：Decision型のデータが複数件まとまった配列のデータ
//void:保存処理だけで、何も返さない型アノテーション
export function saveDecisions(decisionList: Decision[]): void {
  //setItem(key(=データ名), value(=保存するデータ：mustで文字列))：localStorageにデータを保存するメソッド
  //JSON.stringify():引数で受け取った配列（()内のdecisionList）を「文字列」に変換
  //　└localStorageは「文字列」しか保存できないため、decisionList（データが「配列」）を文字列に変換
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decisionList));
}

//「行動、理由、振り返り」のいずれかの記録を 1件だけ新しく追加する
//「全件取得→追加→全件保存」という3段階を踏む

export function addDecision(decision: Decision): void {
  //既にlocalStorageに保存されている記録を「全部取得」する
  const decisionList = getDecisions();
  //引数で受け取った新しい1件（decision）を、decisionListの最後に「追加(.push)」する
  //下記実施後、decisionListのデータは「今までの記録＋新しい1件」になる
  decisionList.push(decision);
  //「今までの記録＋新しい1件」になったdecisionListをsaveDecisions関数に渡し、「全部上書き」保存する
  saveDecisions(decisionList);
}
