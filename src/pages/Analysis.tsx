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
