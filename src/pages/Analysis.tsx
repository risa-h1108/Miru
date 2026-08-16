//分析画面

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { SaveRecord } from "../types";
import { getRecords } from "../utils/localStorage";

export default function Analysis() {
  //選択後の記録データを複数管理する
  //([]):getRecordsがデータなしのとき[](配列)を返すようにする。
  const [analysisRecord, setAnalysisRecord] = useState<SaveRecord[]>([]);

  //画面が最初に表示された1回目だけgetRecordsから情報を取得し、そのデータ(records)をsetAnalysisRecordに渡す
  useEffect(() => {
    const records = getRecords();
    setAnalysisRecord(records);
  }, []);

  //理由ごとの選択回数を集計する処理
  //└analysisRecordの中の各記録を1件ずつ処理し、最終的に「理由ごとの回数」をまとめたオブジェクト(reasonCounts)を作る
  //.reduce()：「配列を順番に処理してまとめる」メソッド
  const reasonCounts = analysisRecord.reduce(
    (count, record) => {
      //forEach：新しい配列を作らず、ただ1つずつ処理するメゾット
      //「1件の記録(record)」の中に「複数の理由(selectedReasons)」がある為、その複数の理由を1つずつ数えるためにforEachを使用
      record.selectedReasons.forEach((reason) => {
        //count[reason]：今数えている理由(例:「疲れている」)の既出回数
        //count[reason] ?? 0：まだ1度も該当の理由を数えていない場合はundefinedになる為、カウントが壊れてNaNにならないよう、undefinedになる場合は右辺の0を代わりに使用。
        //(count[reason] ?? 0) + 1：今までの回数((count[reason] ?? 0))に+1する。
        //count[reason] = ...：計算した新しい回数((count[reason] ?? 0)+1、右辺)をcount[reason](左辺)に代入する(＝更新する)
        count[reason] = (count[reason] ?? 0) + 1;
      });
      //forEachで更新したcount(集計途中のオブジェクト)を、次の1件の処理に引き継ぐために返す
      return count;
    },
    //最初の扱い(,{})：まだ何も数えていない「空のオブジェクト」。
    //型はTSに標準で存在する「Record<string, number>」(キーが文字列("疲れている"など)、値が数値(該当理由の既出回数)を使用。
    //Record<string, number>の型を用いると、{"疲れている": 2,"時間がない": 1,}のようになる。
    {} as Record<string, number>,
  );

  return (
    <div>
      <div className="max-w-sm mx-auto mt-3">
        <h1 className="text-[24px] text-center">分析</h1>
        <h2 className="text-[16px] text-center">あなたの傾向を分析しました</h2>
      </div>

      <div className="max-w-sm mx-auto mt-8">
        <p className="text-[20px] pl-1">理由別の後悔率（やらなかった時）</p>
      </div>

      <Link to="/" />
    </div>
  );
}
