import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AuthFormValues } from "../types";
import { supabase } from "../lib/supabase";

export default function Signup() {
  //処理のあとで移動するので、Link ではなくuseNavigateを使用
  const navigate = useNavigate();

  //メールとパスワードを1つのstateに纏める
  const [form, setForm] = useState<AuthFormValues>({
    email: "", // メール欄の初期値(空文字)
    password: "", // パスワード欄の初期値(空文字)
  });

  //エラー文を管理するstate。nullなら「エラーなし」の意味。
  // 画面に出す値なので、新規登録の結果(成功or失敗)によって変化するstateで記載
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  //新規登録ボタンが押された時、入力されていたemail,passwordをsupabaseに保存する処理
  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    //失敗(エラーあり)の場合：画面遷移せず、エラー文を管理するstateにエラーメッセージを入れて、画面に表示させる
    if (error) {
      setErrorMessage(
        "登録に失敗しました。メールアドレスの形式と、パスワードが8文字以上かを確認してください",
      );
      return; // ここで終了(下の移動は実行しない)
    }

    //成功の場合：エラー文をnullとして、表示せずに「/action」へ移動する
    setErrorMessage(null);
    navigate("/action");
  };

  return (
    <div>
      <h1>新規登録</h1>
      <input
        type="email"
        value={form.email}
        //onChange：文字が打たれるたびに呼ばれる
        //e.target.value：そのとき入力欄に入っている文字列
        //...form：...で既存の中身を全部コピーし、パスワードなど他の値を残したまま、
        // 　　　　emailだけをe.target.valueの文字列に更新する
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        //type="password"にすると、入力された文字表示が「●」で隠れる
        type="password"
        value={form.password}
        //onChange：文字が打たれるたびに呼ばれる
        //e.target.value：そのとき入力欄に入っている文字列
        //...form：...で既存の中身を全部コピーし、emailなど他の値を残したまま、
        // 　　　　passwordだけをe.target.valueの文字列に更新する
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      {/* 新規登録ボタン */}
      {/* ボタンを押したらsupabaseへemail,passwordを登録する処理が実施される */}
      <button onClick={handleSignup}>新規登録する</button>

      {/* エラーメッセージがあるなら(=エラーなら)、赤字でエラーメッセージを表示する */}
      {/* &&：「左が成り立つなら、右を表示する」の意味 */}
      {errorMessage && <p className="text-red-600">{errorMessage}</p>}
    </div>
  );
}
