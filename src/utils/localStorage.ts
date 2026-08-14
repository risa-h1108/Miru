import type { SaveRecord, UnfinishedRecord } from "../types";

//localStorageにデータ保存する用の「振り返り済み記録のキー」
const RECORDS_KEY = "records";
//localStorageにデータ保存する用の「未振り返り記録のキー」
const UNFINISHED_RECORDS_KEY = "unfinishedRecords";

//↓振り返り済み記録の処理

//localStorageに保存されている振り返り済みの記録を「全件取得」する
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
  // └返り値が「any型」のため、型アノテーション（:）では型チェックが素通りするので、型アサーション（as）でSaveRecord[]の形で明記。
  return JSON.parse(json) as SaveRecord[];
}

//localStorageに保存されている「振り返り済み」記録を、複数件をまとめて「全部上書き」保存する
//void:保存処理だけで、何も返さない型アノテーション
export function saveRecords(records: SaveRecord[]): void {
  //recordsを文字列(JSON.stringify)に変換し、RECORDS_KEYの棚にrecordsを保存する
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}

//振り返り済みになったばかりの記録(SaveRecord型の為)を1件だけ受け取って、既存の振り返り済み記録一覧に「1件のみ追加」する
export function addRecord(record: SaveRecord): void {
  const recordsList = getRecords(); //既にlocalStorageに保存されている記録を「全件取得」する
  recordsList.push(record); //引数で受け取った新しい1件（record）を、recordsListの最後に「追加(.push)」する
  saveRecords(recordsList); //「今までの記録＋新しい1件」になったrecordsListをsaveRecords関数に渡し、「全部上書き」保存する
}

//↓未振り返り記録の処理

//localStorageに保存されている未振り返りの記録を「全件取得」する(画面側で1件or全件表示かは変更対応する)
export function getUnfinishedRecords(): UnfinishedRecord[] {
  const json = localStorage.getItem(UNFINISHED_RECORDS_KEY); //全件取得

  //保存データがない場合の処理
  if (!json) {
    return [];
  }
  //保存されているデータがある場合の処理
  return JSON.parse(json) as UnfinishedRecord[];
}

//localStorageに保存されている「未振り返り」記録を、複数件をまとめて「全部上書き」保存する実行役
export function saveUnfinishedRecords(
  unfinishedRecords: UnfinishedRecord[],
): void {
  //recordsを文字列(JSON.stringify)に変換し、UNFINISHED_RECORDS_KEYの棚にrecordsを保存する
  localStorage.setItem(
    UNFINISHED_RECORDS_KEY,
    JSON.stringify(unfinishedRecords),
  );
}

//未振り返りの記録(UnfinishedRecord型の為)を1件だけ受け取って、既存の未振り返りの記録一覧(unfinishedRecordsList)に「1件のみ追加」する
export function addUnfinishedRecord(unfinishedRecord: UnfinishedRecord): void {
  const unfinishedRecordsList = getUnfinishedRecords(); //全件取得(すでに保存されている未振り返り記録を全部持ってくる)
  unfinishedRecordsList.push(unfinishedRecord); //1件追加
  saveUnfinishedRecords(unfinishedRecordsList); //保存(「既存分＋新しい1件」になったunfinishedRecordsListをsaveUnfinishedRecordsに渡して保存する)
}
