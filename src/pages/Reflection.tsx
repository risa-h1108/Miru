//振り返り画面
import { Icon } from "@iconify/react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Result, ResultButton, SupabaseUnfinishedRecord } from "../types";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  getActionId,
  getActionLabel,
  getReasonIds,
  getReasonLabels,
  getUnfinishedDecision,
  insertDecisionReasons,
} from "../utils/supabaseHelpers";

//記録内容ボックスのCSS
const recordBase =
  "w-full max-w-sm mx-auto border border-gray-400 rounded-lg mt-6 p-4 text-xl space-y-1";

//画面上の3ボタンの位置調整CSS
const gridBase = "max-w-sm mx-auto grid grid-cols-3 gap-5 px-2 mb-4 mt-4 ";

//共通のCSS（カード型ボタンの形やサイズ、カード型ボタン内の配置）
const buttonCardsBase =
  "border rounded-lg w-28 h-36 flex flex-col items-center justify-center text-lg";

//結果の「良かった/普通/後悔」の3択ボタンのデータ一覧
const resultList: ResultButton[] = [
  {
    id: "good",
    label: "やってよかった",
    icon: "lucide:smile",
    bgBase: "bg-green-100 hover:bg-green-200",
    bgSelected: "bg-green-300",
    borderColor: "border-green-400",
    //SVGアイコンの色はSVGが「テキストカラーを継承する」設定になっていることが多いため、text-で指定する
    iconColor: "text-green-500",
  },
  {
    id: "neutral",
    label: "どちらでもない",
    icon: "lucide:annoyed",
    bgBase: "bg-amber-100 hover:bg-amber-200",
    bgSelected: "bg-amber-300",
    borderColor: "border-amber-400",
    iconColor: "text-amber-500",
  },
  {
    id: "regret",
    label: "やらなくて後悔",
    icon: "lucide:frown",
    bgBase: "bg-red-100 hover:bg-red-200",
    bgSelected: "bg-red-300",
    borderColor: "border-red-400",
    iconColor: "text-red-500",
  },
];

//メモのCSS
const memoBase =
  " block w-full max-w-sm mx-auto h-36 rounded-lg border border-gray-300 ";

//保存ボタンのCSS
const saveButtonBase =
  "border bg-blue-400 text-white rounded-lg mt-6 w-full max-w-sm mx-auto h-12 flex items-center justify-center text-2xl";

export default function Reflection() {
  //以下のlocation.state?.~は各データを前ページから取得する機能
  const location = useLocation();

  //supabaseから取得した[未振り返り記録]を管理するstate(初期値はnull、取得できるまで表示しない)
  const [record, setRecord] = useState<SupabaseUnfinishedRecord | null>(null);

  //画面が最初に表示された時、未振り返り記録をsupabaseから取得する
  useEffect(() => {
    const fetchRecord = async () => {
      //ReasonsChoiceから遷移して、そのままReflection画面を表示した場合、
      // location.stateにデータがあるので、そこからdecisionIdを取得する
      const decisionId = location.state?.decisionId;

      //decisionIdがあれば(ReasonsChoiceから遷移した場合)、該当の記録をピンポイントで、
      // decisionIdがなければ(タブ切り替えやURL直打ちの場合)、最新1件を取得する
      const { data: unfinishedData, error: unfinishedError } =
        //getUnfinishedDecision関数内部で、decisionIdの有無
        // (Reflection画面への遷移経路で自動的に決定)によって検索方法が自動的に切り替わる
        await getUnfinishedDecision(decisionId);

      //getUnfinishedDecision検索でエラー(検索処理が失敗など)が発生した場合、「又は」
      // unfinishedDataがnullだった場合(振り返るべき記録が見つからなかった場合など)、
      // その場でfetchRecord関数(この非同期処理)を中断するガード処理
      if (unfinishedError || !unfinishedData) {
        console.error("未振り返りdecision取得エラー:", unfinishedError);
        return;
      }

      // [decisions行]に保存されている[action_id(数字、例:3)]から、
      // [action_mastersテーブル]を検索して、表示用の日本語ラベル(例:"勉強する")を取得する処理
      // ※[decisionsテーブル]には[action_id]という数字しか保存されていないため、画面表示にはこの逆引き変換が必要
      const { data: actionLabelData, error: actionLabelError } =
        await getActionLabel(unfinishedData.action_id);

      //getActionLabel検索でエラー(検索処理が失敗など)が発生した場合、「又は」
      // actionLabelDataがnullだった場合、その場でfetchRecord関数を中断するガード処理
      if (actionLabelError || !actionLabelData) {
        console.error("action_masters逆引きエラー:", actionLabelError);
        return;
      }

      //decisionIdから、紐づく[理由ラベルの配列(理由は複数選択が可能な為、複数になりうる)]を取得
      const { data: reasonLabelsData, error: reasonLabelsError } =
        await getReasonLabels(unfinishedData.id);

      //getReasonLabels検索でエラー(検索処理が失敗など)が発生した場合、「又は」
      // reasonLabelsDataがnullだった場合、その場でfetchRecord関数を中断するガード処理
      if (reasonLabelsError || !reasonLabelsData) {
        console.error("reason_masters逆引きエラー:", reasonLabelsError);
        return;
      }
    };

    //実際に上記で定義した関数を呼び出す一文
    fetchRecord();

    //location.stateが変わった時にも再取得して欲しいため、依存配列に追加
  }, [location.state]);

  // //localStorageに保存されている未振り返り記録の全件を取得
  // const unfinishedRecords: UnfinishedRecord[] = getUnfinishedRecords();

  // //location.state(前ページから渡されたデータ)があればそれを使い、
  // //なければlocalStorageに保存されているデータ(＝未振り返り記録)の最新1件を使う
  // const record = location.state ?? unfinishedRecords.at(-1);

  // const selectedAction = record?.selectedAction ?? "";
  // const selectedDecision = record?.selectedDecision ?? null;

  // //:string[]：[location.state]の型をTSが推測できないため明示。
  // //　?? []（空配列）とすることで、値がない場合も型がstring[]のまま保たれる
  // const selectedReasons: string[] = record?.selectedReasons ?? [];

  // //[全ての選択が確定した瞬間(in ReasonsChoice画面)の時間]をReasonsChoice画面から取得
  // const recordedAt = record?.recordedAt ?? "";

  //選択中の結果(3ボタン、[良かった,普通,後悔,null])を管理するstate
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);

  //選択中の結果ボタンがボタンのid("good"など)と一致している場合、それぞれの選択色(bgSelected指定色)を表示する。
  //一致していない場合、未選択時の通常色(bgBase指定色)を表示する。
  //itemにはresultListがmap処理した1つ分のデータが渡される。
  const getResultBg = (item: ResultButton) =>
    selectedResult === item.id ? item.bgSelected : item.bgBase;

  //入力中のメモを管理するstate
  const [memo, setMemo] = useState("");

  const navigate = useNavigate();

  //「保存する」ボタンが押された時の処理
  const saveDecision = async () => {
    //supabaseで[action_masters(行動選択)テーブル]のidを{ data, error }という形で検索結果を返す処理
    const { data: actionData, error: actionError } =
      await getActionId(selectedAction);

    //action_masters検索でエラー(検索処理が失敗など)が発生した場合、「又は」
    // actionDataがnullだった場合、その場で処理を中断するガード処理
    if (actionError || !actionData) {
      console.error("action_mastersへのid検索エラー:", actionError);
      return;
    }

    //supabaseで[reason_masters(理由選択)テーブル]のidを{ data, error }という形で検索結果を返す処理
    const { data: reasonData, error: reasonError } =
      await getReasonIds(selectedReasons);

    //reason_masters検索でエラー(検索処理が失敗など)が発生した場合、「又は」
    // reasonDataがnullだった場合、その場で処理を中断するガード処理
    if (reasonError || !reasonData) {
      console.error("reason_mastersへのid検索エラー:", reasonError);
      return;
    }

    //supabaseの[decisions(決定記録)テーブル]にinsertのデータ({}の中身)を
    // { data, error }という形で受け取って新しい行に追加する処理
    // 新しく作られた決定記録のidの結果例:decisionData　=　{ id: 5 }
    const { data: decisionData, error: decisionError } = await supabase
      .from("decisions")
      //オブジェクトの中身(={}の中身)がdecisionsテーブルに新しい1行として[追加(=insert)]される
      .insert({
        //上で検索したactionData({ id: 1 }のような形)から、id部分だけを取り出す処理。
        //万が一actionDataが[null(検索失敗)]だった場合、エラーで処理が止まるのを防ぐため「?」を使用
        action_id: actionData?.id,

        //selectedDecisionの型定義が[boolean | null]だが、
        // Reflection画面にたどり着く時点で「やる/やらない」はmustで選択済みなので、
        // supabase上で[decisionsテーブル＞decisionカラム]はNOT NULL(必須)設定にした。
        decision: selectedDecision,
        result: selectedResult,
        memo: memo,
      })
      //insertした後、[新しく作った行のid(=select)]を[1件だけ(=single)]返してもらう
      // ※insertだけだと本来「成功したかどうか」程度の情報しか返らない為、下記2点を追加
      .select("id")
      .single();

    //decisionsへの追加でエラー(追加処理が失敗など)が発生した場合、「又は」
    // decisionDataがnullだった場合、その場で処理を中断するガード処理
    if (decisionError || !decisionData) {
      console.error("decisionsへのinsert & id返却エラー:", decisionError);
      return;
    }

    //[decision_reasonsテーブル]に理由が複数選択された場合、理由ごとに複数行insert(追加)する処理

    //reasonData([{ id: 1 }, { id: 2 }])から、idの値だけを取り出して[数字の配列(=map)]に変換
    // r:配列を1つずつ処理する時の、その時点の1要素({ id: 1 }など)を指す変数名
    // r.id:そのオブジェクトからidプロパティの値だけを取り出す
    const reasonIds = reasonData.map((r) => r.id);
    const { error: decisionReasonsError } = await insertDecisionReasons(
      decisionData.id, //直前のdecisionsへのinsertで作られた行のid
      reasonIds, //上で変換した数字だけの配列
    );

    //[decision_reasonsテーブル]へのinsert処理がエラーになった場合、その場で処理を中断するガード処理
    // ※decision_reasonsへinsert後は保存して終わりの為、dataを受け取る処理は記述しない
    if (decisionReasonsError) {
      console.error("decision_reasonsへのinsertエラー:", decisionReasonsError);
      return;
    }

    navigate("/action");
  };

  //record(前ページから渡されたデータor未振り返り記録)があるなら、[?以降の(ここを表示)]、
  //recordがないなら、[:以降の(ここを表示)]
  return record ? (
    <div>
      <div className="max-w-sm mx-auto mt-3">
        <h1 className="text-[24px] text-center">振り返り</h1>
        <h2 className="text-[16px] text-center">結果を記録しましょう</h2>
      </div>

      {/*前のページで記録した内容を表示する部分*/}
      <div className={recordBase}>
        <p>行動：{selectedAction}</p>
        {/*[true/false]で表示されるのを日本語の文字列に変換してから表示する */}
        <p>選択：{selectedDecision ? "やる" : "やらない"}</p>
        {/* flex：「理由：」と値を横並びにする、shrink-0：ラベル部分(「理由：」)の幅を縮めさせない。
            flex + shrink-0 = ぶら下げインデント */}
        <div className="flex">
          <span className="shrink-0">理由：</span>
          {/*.join(区切り文字)：配列の中身(selectedReasons)を指定した区切り文字(、)で繋げて、1本の文字列に変更する */}
          <span>{selectedReasons.join("、")}</span>
        </div>
        <p>日時：{recordedAt}</p>
      </div>

      {/*記録した内容を評価する部分*/}
      <div>
        <div className="max-w-sm mx-auto mt-8">
          <p className="text-[20px] pl-1">結果はどうでしたか？</p>
        </div>

        {/*カード全てを横1列に中央寄せ*/}
        <div className={gridBase}>
          {resultList.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedResult(item.id)}
              className={`${buttonCardsBase} ${getResultBg(item)} ${item.borderColor}`}
            >
              {/*アイコンの表示*/}
              <Icon
                icon={item.icon}
                width={50}
                height={50}
                className={`${item.iconColor} mb-2`}
              />

              {/*ラベル（「勉強する」など）の表示*/}
              {/*「ラベルの部分」と明確にしておくため、spanタグを記載*/}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/*メモ欄*/}
        <h3 className="text-[16px] mb-3 px-2  max-w-sm mx-auto">
          メモ（任意）
        </h3>

        {/*メモ欄のテキストエリア*/}
        <textarea
          //value：メモ欄が今保持している文字列の値
          value={memo}
          //onChange：メモ欄の中身が変わったときに実行される処理
          //｛｝の中身：ユーザーがテキストを入力する度に、その最新の文字列(e.target.value)をsetMemoでstate更新する処理
          //e：入力内容の情報が入ったオブジェクト
          //e.target：イベントが発生したtextareaのこと
          //e.target.value：そのtextareaに、今実際に入力されている文字列
          onChange={(e) => setMemo(e.target.value)}
          placeholder="気づいたことをメモできます"
          className={`${memoBase} p-3 text-[16px]`}
        />
      </div>

      {/*保存ボタン*/}
      <button onClick={saveDecision} className={saveButtonBase}>
        保存する
      </button>
    </div>
  ) : (
    //min-h-screen:画面の高さいっぱいまで広がる
    //flexとmax-w-smが同じ要素に効いてしまい、意図通りの見た目にならない可能性がある為、divとpタグで分けて対応
    <div className="min-h-screen flex items-center justify-center">
      <p className="max-w-sm mx-auto text-center text-4xl text-black">
        振り返るデータがありません
      </p>
    </div>
  );
}
