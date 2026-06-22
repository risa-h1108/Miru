import type { Decision } from "../types";

//localStorageにデータ保存する用のキー名（decisions）を設定
const STORAGE_KEY = "decisions";

/// localStorageに保存されている「行動、理由、振り返り」の記録を全部取得する
export function getDecision(): Decision[] {
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
