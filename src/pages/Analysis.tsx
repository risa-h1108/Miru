//分析画面

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Advice, SaveRecord } from "../types";
import { getRecords } from "../utils/localStorage";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Icon } from "@iconify/react";

//7件それぞれの理由ごとにバーとパーセンテージ％を横並びにするCSS
const regretBarRowBase =
  "w-full max-w-sm mx-auto flex justify-center items-center mt-4";

//アドバイスボックスのCSS
const tipBoxBase =
  "w-full max-w-sm mx-auto h-40 mt-16 rounded-lg border border-amber-300 bg-amber-100";

//理由ごとのアドバイス一覧
const adviceList: Advice[] = [
  {
    reason: "疲れている",
    advice:
      "意外と「3分だけ」ならできることが多いです。タイマーを3分だけセットして始めてみましょう！",
  },
  {
    reason: "面倒くさい",
    advice:
      "準備だけ先に済ませておくと、次に取り掛かるハードルが下がります。道具を出す・アプリを開くだけでもOKです！",
  },
  {
    reason: "不安がある",
    advice:
      "不安な理由を紙に書き出すと、いくつかに分解できます。その中で「今すぐ確認できるもの」(例:やり方をひとつ調べる)から1つ潰してみましょう！",
  },
  {
    reason: "時間がない",
    advice:
      "予定の前後に「3分だけ」の枠をあらかじめ確保しておくと、時間がない日でも取り掛かりやすくなります！",
  },
  {
    reason: "他のことを優先したい",
    advice:
      "他の予定の前に1分だけ着手しておくと、後回しにせず終わらせやすくなります。先に少しだけ手をつけてみましょう！",
  },
  {
    reason: "やり方が分からない",
    advice:
      "わからない部分だけを1つ検索してみましょう。全部理解してから始めるのではなく、わかったところまでで一旦手を動かしてみるのがコツです！",
  },
  {
    reason: "その他",
    advice:
      "できなかった理由を一言メモしておくと、次回同じ状況になっても対策を立てやすくなります！",
  },
];

export default function Analysis() {
  //選択後の記録データを複数管理する
  //([]):getRecordsがデータなしのとき[](配列)を返すようにする。
  const [analysisRecord, setAnalysisRecord] = useState<SaveRecord[]>([]);

  //画面が最初に表示された1回目だけgetRecordsから情報を取得し、そのデータ(records)をsetAnalysisRecordに渡す
  useEffect(() => {
    const records = getRecords();
    setAnalysisRecord(records);
  }, []);

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

  //後悔率が最も高い理由名を取得(regretRatesはソート済みなので先頭(0)が後悔率最大)
  //regretRates[0]でそのオブジェクト({ reason: "疲れている", rate: 80 }など)を取り出し、
  //.reasonをつなげることで、その中の理由名(文字列)だけを取り出している
  const topReason = regretRates[0].reason;

  //topReason(最も後悔率が高い理由の名前)に対応するアドバイスを、adviceListの中から探す
  //.find()：配列の中から、条件に最初に一致した1件だけを返すメソッド
  //adviceListを1件ずつ調べ、item.reason(各アドバイスに紐づく理由名)がtopReasonと一致するものを探す
  //一致するものが見つからなければ、matchedはundefinedになる
  const matched = adviceList.find((item: Advice) => item.reason === topReason);

  //matched(topReason(最も後悔率が高い理由名)に一致したアドバイス)があればそれを使い、
  //無ければ(adviceListに一致する理由が登録されていないイレギュラー時)フォールバック用の文言(?? "ここ")を使う
  //matched?.advice：matchedがundefinedの場合はエラーにならず、undefinedを返す(?:オプショナルチェイニング)
  const fallbackAdvice =
    matched?.advice ?? "該当するアドバイスが見つかりませんでした。";

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

      {/* space-y-4：各バーの縦の隙間を調整 */}
      <div className="mt-8 space-y-4">
        {/*map処理で7つのバーを生成*/}
        {regretRates.map((item) => (
          //1件ごとに(理由名・バー・パーセンテージを1セットとして)横並びにする
          <div key={item.reason} className={regretBarRowBase}>
            {/* 理由名を表示 */}
            {/* shrink-0：理由名が縮まないようにする、whitespace-nowrap：折り返さない */}
            <span className="w-35 shrink-0 whitespace-nowrap">
              {item.reason}
            </span>

            {/* バー部分 */}
            {/* 理由名、％のレイアウト：Tailwind、バーの背景色、色付き部分：Rechartsと役割を分担 */}

            {/* flex-1：残りのスペースをバーが埋める */}
            <div className="flex-1">
              {/* width="100%"：親要素の幅に合わせる、height={20}：高さは1行分の薄いバーになるように調整 */}
              <ResponsiveContainer width="100%" height={20}>
                <BarChart
                  //全件(regretRates)ではなく、各バーの1件ずつだけを配列にして渡す。trackという「常に100固定」のダミー値を追加
                  data={[{ ...item, track: 100 }]}
                  layout="vertical" //(デフォルトが縦の為)棒を横方向に伸ばす
                  barGap="-100%" //track用・rate用の2本のBarを横にずらさず、完全に重ねて描画するため
                  margin={{ top: 0, right: 0, bottom: 0, left: 0 }} //理由名・%用の余白はTailwindCSSで調整するため、Rechartsでは全て0を指定
                >
                  {/* 横軸を数字にして、後悔率を表示 */}
                  {/* hide:軸を表示しない domain：横軸が常に0-100までになるよう固定*/}
                  <XAxis type="number" domain={[0, 100]} hide />

                  {/* 縦軸をカテゴリーにして、理由名を表示 */}
                  {/* hide:軸を表示しない */}
                  <YAxis type="category" dataKey="reason" hide />

                  {/* 補足：backgroundプロパティは値が0のとき背景ごと描画されない挙動があったため、
                  常に固定値(track)を持つBarと、実際の値(rate)を持つBarを重ねて描く方式に変更した　*/}

                  {/* 背景トラック用:常にtrack=100なので、rateの値に関わらず必ず描画される */}
                  <Bar dataKey="track" fill="#e5e7eb" radius={10} />

                  {/* 色付きの部分：実際の後悔率のバー */}
                  <Bar
                    dataKey="rate"
                    fill="#EFA477" //色付き部分の色をfillで直接指定。
                    radius={10} //実際のバーの角を丸くする
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 理由ごとのパーセンテージ％を各バーの右側に表示する */}
            {/* shrink-0：%が縮まないようにする、w-10:数字％の幅が数字によって異ならないように指定、
             　　text-right：数字を右揃えにする　*/}
            <span className="w-10 pl-2 text-right shrink-0">{item.rate}%</span>
          </div>
        ))}
      </div>

      {/*アドバイスボックス*/}
      <div className={tipBoxBase}>
        <h3 className="text-[20px] mt-3 mb-1 px-4 flex items-center justify-center">
          <Icon icon={"lucide:lightbulb"} width={25} height={25} />
          あなたへのアドバイス
        </h3>
        <p className="text-[16px] text-center px-5 ">
          「疲れている」を理由にやらなかったときは、
          <br />
          後悔しやすい傾向はがあります。
          <br />
          「5分だけやる」など小さく始めることで
          <br />
          行動しやすくなります！
        </p>
      </div>

      <Link to="/" />
    </div>
  );
}
