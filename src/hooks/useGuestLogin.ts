import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

//ゲストログインの処理を、[Login]と[Signup]で共通に使うための部品(カスタムフック)
//名前が[use]で始まるのは、Reactに「これはフックです」と伝えるための決まり
export function useGuestLogin(
  //使う側(Loginなど)からuseGuestLoginが受け取る値の型
  captchaToken: string | null, //captchaToken(合格証)の型

  //resetCaptcha：合格証の取り替え処理
  //() => void：resetCaptchaの型で何も受け取らず[=()]、何も返さない[=void]関数[=>]
  resetCaptcha: () => void,
) {
  //[useNavigate/useState]は、[コンポーネント]か[use〜]の関数の中でしか使えない
  const navigate = useNavigate();

  //ゲストログイン専用のエラー文(null=エラーなし)
  //ログインのエラー(errorMessage)とは、別のstateにして混ざらないようにする
  const [guestError, setGuestError] = useState<string | null>(null);

  //ゲストボタンが押されたときの処理
  const handleGuest = async () => {
    //トークンがまだないときは、送らずに終わる(ウィジェットの確認待ち)
    if (!captchaToken) {
      setGuestError("確認中です。1～2秒後に、もう一度押してください。");
      return;
    }

    //signInAnonymously({ options: { captchaToken } })：合格証(captchaToken)を添えて、匿名サインイン(メールもパスワードも不要)する
    const { error } = await supabase.auth.signInAnonymously({
      options: { captchaToken },
    });

    //トークンは使い捨てのため、成功でも失敗でも新しいトークンに取り替える
    resetCaptcha();

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
