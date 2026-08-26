//分析画面

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { SaveRecord } from "../types";
import { getRecords } from "../utils/localStorage";
import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

//7件それぞれの理由ごとにバーとパーセンテージ％を横並びにするCSS
const regretBarRowBase =
  "w-full max-w-sm mx-auto flex justify-center items-center mt-4";

export default function Analysis() {
  //選択後の記録データを複数管理する
  //([]):getRecordsがデータなしのとき[](配列)を返すようにする。
  const [analysisRecord, setAnalysisRecord] = useState<SaveRecord[]>([]);

  //画面が最初に表示された1回目だけgetRecordsから情報を取得し、そのデータ(records)をsetAnalysisRecordに渡す
  useEffect(() => {
    const records = getRecords();
    setAnalysisRecord(records);
  }, []);

  //理由ごとの選択回数を集計する処理(全件の理由別回数)
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

  //理由ごとの「やらなかった」件数を集計する処理(「やらなかった」時の理由別回数)
  const falseDecisionCounts = analysisRecord.reduce(
    (count, record) => {
      //記録内で「やらない」を選択した記録のみをifでチェックして、falseを選んだ記録だけ理由ごとにカウントアップする
      if (record.selectedDecision === false) {
        record.selectedReasons.forEach((reason) => {
          count[reason] = (count[reason] ?? 0) + 1;
        });
      }
      return count;
    },
    {} as Record<string, number>,
  );

  //理由ごとに「後悔(regret)」だった件数を集計する処理(「やらなかった」かつ「後悔した」時の理由別回数)
  const regretReasonCounts = analysisRecord.reduce(
    (count, record) => {
      if (
        //記録済みのデータ内で「やるorやらない」を「やらない」と選択したデータと
        //記録済みのデータ内で「結果」を「後悔」と選択したデータが両方満たすときだけカウントする
        record.selectedDecision === false &&
        record.selectedResult === "regret"
      ) {
        record.selectedReasons.forEach((reason) => {
          count[reason] = (count[reason] ?? 0) + 1;
        });
      }
      return count;
    },
    {} as Record<string, number>,
  );

  //件数から後悔率(%)を計算する処理
  //Object.keys()：オブジェクト(()内のもの)に実際にあるキーだけを返すため、
  //Object.keys(falseDecisionCounts)で取り出すreasonは、必ず1回以上カウントされたキーだけの為、0にはならない。
  const regretRates = Object.keys(falseDecisionCounts)
    .map((reason) => {
      //理由ごとの後悔回数(rate、割合)を計算し、{ reason, rate }という形にまとめる
      //Math.round():計算式(... * 100)が終わった後までMath.round()で囲んで、計算時に四捨五入して整数にするメソッドを使用
      const rate = Math.round(
        //regretReasonCounts[reason]：[]は取り出し(参照)の意味
        //└regretReasonCountsというオブジェクトの中からreasonという名前(ex)”疲れている”など)に対応する値(何回選択されたか)を読み取る
        //(regretReasonCounts[reason] ?? 0)： 該当理由が一度も「後悔」として記録されていない(undefined)場合は0として扱う
        ((regretReasonCounts[reason] ?? 0) / falseDecisionCounts[reason]) * 100,
      );
      //{ reason: "疲れている", rate: 40 }のようなオブジェクトで返される
      return { reason: reason, rate: rate };
    })
    //後悔率の高い順(大きい順)に.sortで並ばせて、ランキング形式にする
    .sort((a, b) => b.rate - a.rate);
  console.log(regretRates);

  return (
    <div>
      <div className="max-w-sm mx-auto mt-3">
        <h1 className="text-[24px] text-center">分析</h1>
        <h2 className="text-[16px] text-center">あなたの傾向を分析しました</h2>
      </div>

      <div className="max-w-sm mx-auto mt-8">
        <p className="text-[20px] pl-1">
          後悔しやすい『やらない理由』ランキング
        </p>
      </div>

      {/* 理由別の後悔率バーの表示 */}
      <div className="mt-8">
        {/* 今後、複数種類のグラフを使用する可能性を考え、データ可視化にチャートライブラリのRechartsを使用 */}
        {/* UI・レイアウト → Tailwind、データ可視化 → Recharts と役割を分担 */}

        {/* width="100%"：親要素の幅に合わせる、height={300}：高さは300px確保する */}
        <ResponsiveContainer width="100%" height={300}>
          {/* layout="vertical":(デフォルトが縦の為)棒を横方向に伸ばす */}
          <BarChart
            data={regretRates}
            layout="vertical"
            margin={{ left: 140, right: 50 }}
          >
            {/* 横軸を数字にして、後悔率を表示 */}
            {/* hide:軸を表示しない domain：横軸が常に0-100までになるよう固定*/}
            <XAxis type="number" domain={[0, 100]} hide />

            {/* 縦軸をカテゴリーにして、理由名を表示 */}
            {/* hide:軸を表示しない */}
            <YAxis type="category" dataKey="reason" hide />

            {/* regretRatesの各データの中にあるrateの値を「棒の大きさ(長さ)」として使用 */}
            {/* fill属性(図形の中身)に棒の背景色(#e5e7eb)を指定、radius：バーの角を丸くする指定*/}
            <Bar dataKey="rate" background={{ fill: "#e5e7eb" }} radius={10}>
              <LabelList dataKey="reason" position="left" />
              <LabelList
                dataKey="rate"
                position="right"
                formatter={(value) => `${value}%`} //valueには各行のrate(後悔率の数値)が入る。返り値に％をつけた形
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <Link to="/" />
    </div>
  );
}

//  {/*map処理で7つのバーを生成*/}
//         {regretRates.map((item) => (
//           //1件ごとに(理由名・バー・パーセンテージを1セットとして)横並びにする
//           <div key={item.reason} className={regretBarRowBase}>
//             {/* 理由名(「疲れている」など)を表示 */}
//             {/* shrink-0：理由名が縮まないようにする、whitespace-nowrap：折り返さない */}
//             <span className="w-35 shrink-0 whitespace-nowrap">
//               {item.reason}
//             </span>

//             {/* バーの「枠(背景)」 */}
//             {/* 空白部分を視覚的に見せれるように、バーの中身を[枠内のdiv]に入れる */}
//             {/* flex-1：残りのスペースをバーが埋める */}
//             <div className="bg-gray-200 flex-1 h-4 rounded">
//               {/* バーの「中身(rateに応じて伸びる部分)」 */}
//               <div
//                 className="bg-blue-400 h-4 rounded"
//                 //item.rate(後悔率の数値＝後悔している割合)を使って、バーの横幅(width)をrate%にする
//                 //内側の{}は「CSSプロパティをオブジェクトで書く」という意味
//                 style={{ width: `${item.rate}%` }}
//               />
//             </div>

//             {/* 理由ごとのパーセンテージ％を各バーの右側に表示する */}
//             {/* shrink-0：%が縮まないようにする、w-10:数字％の幅が数字によって異ならないように指定、
//             　　text-right：数字を右揃えにする　*/}
//             <span className="w-10 pl-2 text-right shrink-0">{item.rate}%</span>
//           </div>
//         ))}
