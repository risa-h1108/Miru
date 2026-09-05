//気づきBOXやアドバイスBOXなどの動的メッセージ機能

import type { SaveRecord } from "../types";

//理由ごとの後悔率を計算する関数
export function calculateRegretRates(targetRecords: SaveRecord[]) {
  //理由ごとの「やらなかった」件数を集計する処理(「やらなかった」時の理由別回数)
  const falseDecisionCounts = targetRecords.reduce(
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
  const regretReasonCounts = targetRecords.reduce(
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

  //同じ関数内で書いたconstは、下のJSXでそのまま使えるが、
  //別の関数に切り出すと(呼び出し元の関数(Analysisなど)から見て別の関数だから)、
  //「値を返す(returnの記載)」をしないと呼び出し元(Analysisなど)に値が渡らなくなる
  return regretRates;
}
