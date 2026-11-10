//Turnstile(人間か確認する認証サービス)の合格証(トークン)と、リモコン、取り替え処理をまとめたフック

import { useRef, useState } from "react";
import type { TurnstileInstance } from "@marsidev/react-turnstile";

export function useCaptcha() {
  //Turnstile(人間か確認する認証サービス)を通ったときに受け取る「合格証(トークン)」を管理するstate
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  //Turnstileの部品を、あとから操作(リセット)するための「リモコン」
  const turnstileRef = useRef<TurnstileInstance>(null);

  //トークンは使い捨てのため、成功でも失敗でも新しいトークンに取り替える(2行を1行にした)
  const resetCaptcha = () => {
    setCaptchaToken(null); //stateに入っている古い合格証を空にする
    //リモコン(turnstileRef)で、ウィジェットに「新しい合格証を取り直して(reset)」と指示する
    turnstileRef.current?.reset();
  };

  return { captchaToken, setCaptchaToken, turnstileRef, resetCaptcha };
}
