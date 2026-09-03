//分析画面

import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Advice, SaveRecord } from "../types";
import { getRecords } from "../utils/localStorage";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Icon } from "@iconify/react";
import { reasonsList } from "./ReasonsChoice";

//7件それぞれの理由ごとにバーとパーセンテージ％を横並びにするCSS
const regretBarRowBase =
  "w-full max-w-sm mx-auto flex justify-center items-center mt-4";

//アドバイスボックスのCSS
const tipBoxBase =
  "w-full max-w-sm mx-auto min-h-40 mt-16 pb-2 rounded-lg border border-amber-300 bg-amber-100";

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

  //ダミーデータ:記録が0件の場合、reasonsListの各理由名に[rate:0]を割り当てる
  const emptyRates = reasonsList.map((item) => ({
    reason: item.label,
    rate: 0,
  }));

  //実際に表示する配列:記録が1件以上ある場合、regretRates(後悔率)を表示させる。
  // 　　　　　　　　　記録が0件の場合、ダミー(emptyRates)を使用する。
  const displayRates = regretRates.length > 0 ? regretRates : emptyRates;

  //後悔率が最も高い理由名を取得(regretRatesはソート済みなので先頭(0)が後悔率最大)
  //regretRatesが記録が1件以上ある場合のみ、topReason以降を計算する。
  //0件の場合、topReason・matched・displayAdviceは全てundefinedにする
  //regretRates[0]でそのオブジェクト({ reason: "疲れている", rate: 80 }など)を取り出し、
  //.reasonをつなげることで、その中の理由名(文字列)だけを取り出している
  const topReason = regretRates.length > 0 ? regretRates[0].reason : undefined;

  //topReason(最も後悔率が高い理由の名前)に対応するアドバイスを、adviceListの中から探す
  //.find()：配列の中から、条件に最初に一致した1件だけを返すメソッド
  //adviceListを1件ずつ調べ、item.reason(各アドバイスに紐づく理由名)がtopReasonと一致するものを探す
  //一致するものが見つからなければ、matchedはundefinedになる
  const matched = adviceList.find((item: Advice) => item.reason === topReason);

  //画面に表示するアドバイス文(matchedがあればそのadvice、無ければデフォルト文言)
  //matched(topReason(最も後悔率が高い理由名)に一致したアドバイス)があればそれを使い、
  //無ければ(adviceListに一致する理由が登録されていないイレギュラー時)フォールバック用の文言(?? "ここ")を使用
  //matched?.advice：matchedがundefinedの場合はエラーにならず、undefinedを返す(?:オプショナルチェイニング)
  const displayAdvice = matched?.advice ?? "データがまだ十分にありません。";

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
      {/* regretRatesの要素数が0件の場合、opacity-40(透明度40%で薄く見える＝グレーアウト)を適用。
      regretRatesの要素数が0件でない(1件以上ある)場合、空文字を返し、[mt-8 space-y-4]だけを適用。 */}
      <div
        className={`mt-8 space-y-4 ${regretRates.length === 0 ? "opacity-40" : ""}`}
      >
        {/*map処理で7つのバーを生成(記録が0件の場合はダミーデータ(emptyRates)を表示)*/}
        {displayRates.map((item) => (
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
        {/* タイトルの部分 */}
        <h3 className="text-[20px] mt-3 mb-1 px-4 flex items-center justify-center">
          <Icon icon={"lucide:lightbulb"} width={25} height={25} />
          あなたへのアドバイス
        </h3>

        {/*後悔する理由の表示*/}
        {/* leading-relaxed:行間やや広めにする */}
        <p className="text-[16px] text-center px-5 leading-relaxed">
          {/* topReasonがある場合(記録が1件以上ある時)のみ、下記の2行を表示する */}
          {/* topReason && (...)：topReasonがundefined(記録0件)のときはfalsyと判定され、右側の(...)は描画されずスキップされる */}
          {/* <>...</>：複数行のJSXを、余計なdivタグを増やさずに1つにまとめるためのフラグメント */}
          {topReason && (
            <>
              「{topReason}」を理由にやらなかったときは、
              <br />
              後悔しやすい傾向はがあります。
            </>
          )}

          <br />

          {/* displayAdvice:理由に応じたアドバイス文を表示(matchedがあればそのadvice、無ければデフォルト文言) */}
          {/* displayAdvice(理由に応じたアドバイス文)を、\nの位置で改行して表示する */}
          {/* .split("\n")：文字列を\nの位置で分割し、文字列の配列にする(例:"A\nB" → ["A", "B"]) */}
          {/* .map((line, index) => ...)：分割した各行(line)を1つずつ処理し、<br />付きで表示する */}
          {/* <Fragment key={index}>：.mapで複数要素を作る際に必要なkeyを付けるための入れ物。
                                     一意な値が無いためindex(連番)をkeyとして使用 */}
          {displayAdvice.split("\n").map((line, index) => (
            <Fragment key={index}>
              {line}
              <br />
            </Fragment>
          ))}
        </p>
      </div>

      <Link to="/" />
    </div>
  );
}
