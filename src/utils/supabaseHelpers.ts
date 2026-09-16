//supabase連携で同じロジックが2箇所以上で必要になったため、切り出し

import { supabase } from "../lib/supabase";

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
