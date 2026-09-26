//supabase連携で同じロジックが2箇所以上で必要になったため、切り出し

import { supabase } from "../lib/supabase";
import type { Result } from "../types";

//[action_masters]テーブルから、labelに一致するidを検索する
// supabaseで[action_masters(行動選択)テーブル]のidを{ data, error }という形で検索結果を返す処理
export async function getActionId(label: string) {
  const { data, error } = await supabase
    //action_mastersというテーブルを[操作(=from)]
    .from("action_masters")
    //id列だけ[取得(=select)]
    .select("id")

    //"label"列(action_mastersテーブルのカラム名)が、引数labelの値(例:"勉強する")と[一致する(=eq)]行だけに絞り込む
    // 1つ目の"label"(文字列):action_mastersテーブルのカラム名(列の名前)。DBに実在する列名を文字列として指定。
    // 2つ目のlabel(変数名):この関数の引数(呼び出す時に渡された値、例:"勉強する")。

    //引数名をlabelという汎用的な名前にすることで、この関数は「特定の画面専用」にならず、
    // Reflection.tsx/ReasonsChoice.tsxなど、どのファイルからでも
    // 上記ファイルがすでに持っている変数(selectedActionなど、名前は何でもよい)を
    // そのままgetActionId(...)の()に入れるだけでlabelを呼び出せる
    .eq("label", label)
    //結果は1件だけなので、配列ではなく[1つのオブジェクト(=single)]で返す
    .single();

  //検索した結果(dataとerror)を呼び出し元(フロントエンド側)に返す処理
  return { data, error };
}

//[reason_mastersテーブル]から、labels(複数形)の配列に一致するidたちを検索する
// supabaseで[reason_masters(理由選択)テーブル]のidを{ data, error }という形で検索結果を返す処理
export async function getReasonIds(labels: string[]) {
  const { data, error } = await supabase
    .from("reason_masters")
    .select("id")
    //label列がlabels配列の中の[どれかと一致する(=in)]行を全部取得する
    // "label"(1つ目):reason_mastersテーブルのカラム名(単数形、DBの列名)
    // labels(2つ目):この関数の引数(複数形、渡された配列)
    .in("label", labels);

  //selectedReasonsは複数選ばれる可能性がある為、
  // reasonDataは「配列のオブジェクト」で返ってくる場合があるので、
  // .single()(1件だけを強制するオプション)を付けない

  //検索した結果(dataとerror)を呼び出し元(フロントエンド側)に返す処理
  return { data, error };
}

//[decision_reasonsテーブル]に[1つのdecisionId]と[複数のreasonId]のペアをまとめてinsertする
//＝[decision_reasonsテーブル]に理由が複数選択された場合、理由ごとに複数行insert(追加)する処理
export async function insertDecisionReasons(
  //decisionsテーブルにinsertして作成された、決定記録のid(例:5)
  decisionId: number,
  //reason_mastersテーブルから検索した、複数の[理由id]の配列(例:[1, 2])
  reasonIds: number[],
) {
  //reasonIdsの配列の各要素(reasonId)を、decision_reasonsテーブルに入れる際の形
  // ({ decision_id, reason_id }のオブジェクト)に変換(=map)する処理
  // 結果例: [{ decision_id: 5, reason_id: 1 }, { decision_id: 5, reason_id: 2 }]
  const rows = reasonIds.map((reasonId) => ({
    decision_id: decisionId,
    reason_id: reasonId,
  }));

  //rows(オブジェクトの配列)をdecision_reasonsテーブルに[複数行まとめてinsert]する処理
  // ※この後dataを使う予定がないので、errorだけを受け取る
  const { error } = await supabase.from("decision_reasons").insert(rows);

  //insert処理の結果(成功ならnull、失敗ならエラー内容)を呼び出し元(フロントエンド側)に返す処理
  return { error };
}

//未振り返りのdecision行を取得する。
//タブ切り替え後などでdecisionIdが分からない場合があるので、
// その時はdecisionIdを渡さずに呼び出し、代わりに「result IS NULLの最新1件」を検索する
// 上記の時のため、?を付けてdecisionIdが必ず渡されなくてもOKにする。
//ReasonsChoiceから遷移直後はlocation.stateにdecisionIdがあるため、
// そのdecisionIdを渡して、ピンポイントで対象の行を取得できる
export async function getUnfinishedDecision(decisionId?: number) {
  const query = supabase
    .from("decisions")
    .select("id, created_at, action_id, decision, result, memo");

  const { data, error } = decisionId
    ? //"id"列がdecisionIdと一致する行を追加して、1件だけ取得する
      await query.eq("id", decisionId).single()
    : await query
        //"result"列がnull(まだ振り返っていない)行に絞り込む
        // ※複数件ヒットする可能性があり
        .is("result", null)
        //created_at列で並び替え、ascending(昇順): false(降順・新しい順)にする
        .order("created_at", { ascending: false })
        //orderで並び替えた結果の[先頭1件だけ(=limit(1))]に絞り込む
        .limit(1)
        //1件のオブジェクトとして返す
        // ※[.order()+.limit(1)]で明確に1件だけに絞り込まれているので、
        // singleをエラーを出さずに使用可能
        .single();

  //検索した結果(dataとerror)を呼び出し元(フロントエンド側)に返す処理
  return { data, error };
}

//action_mastersテーブルから、actionIdに一致するlabelを取得する。
// ※[decisionsテーブルのaction_id]はidの数字しか持っていないため、
//   画面に表示する日本語ラベルを下記で取得する必要がある。

// getActionLabel：idからラベル文字列を検索する(表示時に使う)
// getActionId(in Reflection.tsx)：ラベル文字列からidを検索する(保存時に使う)
export async function getActionLabel(actionId: number) {
  const { data, error } = await supabase
    .from("action_masters")
    //label列だけ取得(=select)
    .select("label")
    //id列がactionIdの値と一致する行だけに絞り込む
    // ※actionIdは主キー(Primary Key)の為、自動的に一意性(ユニーク性)が保証されており1件しかない
    .eq("id", actionId)
    .single();

  return { data, error };
}

//[decision_reasonsテーブル]と[reason_mastersテーブル]を結合して、
// その[decisionId]に紐づく[理由labelの配列]を取得する
export async function getReasonLabels(decisionId: number) {
  const { data, error } = await supabase
    .from("decision_reasons")
    //"reason_masters(label)"：[decision_reasonsテーブルのreason_id]を辿って、
    // 　繋がっている[reason_mastersテーブルのlabel]まで一気に取得できる。SQLのJOINに相当。
    .select("reason_masters(label)")
    //[decision_reasonsテーブルに存在するdecision_id列]が
    // [getReasonLabels関数の引数であるdecisionIdの値(＝振り返り画面で表示したい記録1件のid)]と一致する行を全部取得する
    // ＝決定記録(id=数字)に紐づいている理由を全て取得(複数選択している可能性ある為)
    .eq("decision_id", decisionId);

  return { data, error };
}

//[decisionsテーブル]の既存の1行(result/memoのみ)を更新する
// ※action_id/decisionはReasonsChoice.tsxで既にinsert済みのため、ここでは触らない
export async function updateDecision(
  //更新対象を一意(ユニーク)に絞り込むための[decisions行自身のid]
  decisionId: number,

  //振り返り画面で選択された結果("good"/"neutral"/"regret"のいずれか、またはnull)
  result: Result | null,

  //振り返り画面で入力されたメモ
  memo: string,
) {
  const { error } = await supabase
    .from("decisions")

    //[result/memoの2列だけ]を更新対象にする(=update()の引数に渡したキーだけが書き換わり、他の列は変化しない)
    .update({ result, memo })

    //"id"列がdecisionIdと[一致する行だけ(=.eq)]を更新する
    // ※これが無いとdecisionsテーブルの[全行のresult/memo]が書き換わってしまうので必須
    .eq("id", decisionId);

  //update処理の結果(成功ならnull、失敗ならエラー内容)を呼び出し元に返す
  return { error };
}

//振り返り済み(=result列がnullではない)記録一覧を取得する
//下記関数をReasonsChoice.tsxの気づきBOX(calculateRegretRatesに渡す用)で使用
export async function getFinishedDecisions() {
  const { data, error } = await supabase
    .from("decisions")
    //[decisionsテーブル自身の列]と[JOINで取ってくる列]を1回のselectでまとめて取得する
    // action_masters(label)：[decisions.action_id]が指す[action_masters.id]を辿って、
    //   　紐づくlabel(行動名)まで一気に取得(SQLのJOINに相当)
    // decision_reasons(reason_masters(label))：[decisions.id]に紐づく[decision_reasons(=中間テーブル)]を経由して、
    //   　さらにその先の[reason_masters.label(理由名)]まで一気に取得(2段階のJOIN)
    .select(
      "id, created_at, decision, result, memo, action_masters(label), decision_reasons(reason_masters(label))",
    )
    //"result"列がnullでは[ない(=.not)]行だけに絞り込む(振り返り済みの行だけを対象にする為)
    // ※[.is("result", null)(="result"列がnullである)]を逆にした
    .not("result", "is", null);

  // 件数が確定していない(0件〜複数件)ため、.single()は付けない

  //検索した結果(dataとerror)を呼び出し元(フロントエンド側)に返す処理
  return { data, error };
}
