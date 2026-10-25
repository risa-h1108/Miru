import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

//ゲストログインの処理を、[Login]と[Signup]で共通に使うための部品(カスタムフック)
//名前が[use]で始まるのは、Reactに「これはフックです」と伝えるための決まり
export function useGuestLogin() {
  //[useNavigate/useState]は、[コンポーネント]か[use〜]の関数の中でしか使えない
  const navigate = useNavigate();

  //ゲストログイン専用のエラー文(null=エラーなし)
  //ログインのエラー(errorMessage)とは、別のstateにして混ざらないようにする
  const [guestError, setGuestError] = useState<string | null>(null);

  //ゲストボタンが押されたときの処理
  const handleGuest = async () => {
    //signInAnonymously()：引数なしで呼べる(メールもパスワードも不要)
    const { error } = await supabase.auth.signInAnonymously();

    //失敗(エラーあり)の場合：画面遷移せず、エラー文を管理するstateにエラーメッセージを入れて、画面に表示させる
    if (error) {
      setGuestError(
        "ゲストログインに失敗しました。時間をおいて、もう一度お試しください。",
      );
      return;
    }

    //成功の場合：エラー文をnullとして(=エラー文を消して)、表示せずに「/action」へ移動する
    setGuestError(null);
    navigate("/action");
  };

  //使う側(画面側)に渡すもの。{ } のなかで必要なものだけ取り出せる。
  return { handleGuest, guestError };
}
