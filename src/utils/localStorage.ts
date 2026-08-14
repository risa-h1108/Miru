import type { SaveRecord, UnfinishedRecord } from "../types";

//localStorageにデータ保存する用の「振り返り済み記録のキー」
const RECORDS_KEY = "records";
//localStorageにデータ保存する用の「未振り返り記録のキー」
const UNFINISHED_RECORDS_KEY = "unfinishedRecords";

//localStorageに保存されている振り返り済みの記録を「全部取得」する
export function getRecords(): SaveRecord[] {
  //RECORDS_KEYを元に情報を取得する処理
  //getItem():localStorageから()内に適したデータを取得するメソッド
  //  └返り値：「文字列」か「null」のどちらかのみ
  const json = localStorage.getItem(RECORDS_KEY);

  //保存データがない場合の処理
  //jsonがnull（または空文字列）だったら、空の配列[]を返す
  if (!json) {
    return [];
  }

  //保存されているデータがある場合の処理
  //JSON.parse()：localStorageから取り出した「文字列」のデータを、元の形（配列やオブジェクト）に変換
  // └返り値が「any型」のため、型アノテーション（:）では型チェックが素通りするので、
  //  型アサーション（as）でSaveRecord[]の形と明記。
  return JSON.parse(json) as SaveRecord[];
}

//localStorageに保存されている未振り返りの記録を「全件取得」する(画面側で1件or全件表示かは変更対応する)
export function getUnfinishedRecords(): UnfinishedRecord[] {
  const json = localStorage.getItem(UNFINISHED_RECORDS_KEY);

  //保存データがない場合の処理
  if (!json) {
    return [];
  }

  //保存されているデータがある場合の処理
  return JSON.parse(json) as UnfinishedRecord[];
}
