//気づきBOXやアドバイスBOXなどの動的メッセージ機能

import type { Advice, SaveRecord } from "../types";

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

//理由ごとのアドバイス一覧
const adviceList: Advice[] = [
  {
    reason: "疲れている",
    advice:
      "意外と「3分だけ」ならできることが多いです。\nタイマーを3分だけセットして始めてみましょう！",
  },
  {
    reason: "面倒くさい",
    advice:
      "準備だけ先に済ませておくと、\n次に取り掛かるハードルが下がります。\n道具を出す・アプリを開くだけでもOKです！",
  },
  {
    reason: "不安がある",
    advice:
      "不安な理由を紙に書き出すと、\nいくつかに分解できます。\nその中で「今すぐ確認できること」\n(ex:やり方を1つ調べる)から1つずつ潰してみましょう！",
  },
  {
    reason: "時間がない",
    advice:
      "予定の前後に「3分だけ」の枠を\nあらかじめ確保しておくと、\n時間がない日でも取り掛かりやすくなります！",
  },
  {
    reason: "他のことを優先したい",
    advice:
      "他の予定の前に1分だけ着手しておくと、\n後回しにせず終わらせやすくなります。\n先に少しだけ手をつけてみましょう！",
  },
  {
    reason: "やり方が分からない",
    advice:
      "わからない部分だけを1つ検索してみましょう！\n全部理解してから始めるのではなく、\n「わかったところまで」で\n一旦手を動かしてみるのがコツです！",
  },
  {
    reason: "その他",
    advice:
      "できなかった理由を一言メモしておくと、\n次回同じ状況になっても対策を立てやすくなります！",
  },
];

//渡された理由名に対応するアドバイス文を返す、一致するものがなければデフォルト文を返す処理。
//reason:アドバイスを探したい対象の理由名を表す
export function getAdvice(reason: string | undefined) {
  //Analysis側([一番後悔率が高い理由名]で使用)でもReasonsChoice側([今選んでる理由名]で使用)でも使える、
  //reasonに対応するアドバイスをadviceListの中から探す処理

  //.find()：配列の中から、条件に最初に一致した1件だけを返すメソッド
  //adviceListを1件ずつ調べ、item.reason(各アドバイスに紐づく理由名)がreasonと一致するものを探す
  //一致するものが見つからなければ、matchedはundefinedになる
  const matched = adviceList.find((item: Advice) => item.reason === reason);

  //画面に表示するアドバイス文(matchedがあればそのadvice、無ければデフォルト文言)

  //matched(reason[引数reasonに一致したアドバイス])があればそれを使い、
  //無ければ(adviceListに一致する理由が登録されていないイレギュラー時)フォールバック用の文言(?? "ここ")を使用
  //matched?.advice：matchedがundefinedの場合はエラーにならず、undefinedを返す(?:オプショナルチェイニング)
  const displayAdvice = matched?.advice ?? "データがまだ十分にありません。";

  return displayAdvice;
}
