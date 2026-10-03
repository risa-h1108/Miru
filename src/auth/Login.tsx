import { useState } from "react";
import type { AuthFormValues } from "../types";

export default function Login() {
  //メールとパスワードを1つのstateに纏める
  const [form, setForm] = useState<AuthFormValues>({
    email: "", // メール欄の初期値(空文字)
    password: "", // パスワード欄の初期値(空文字)
  });

  return <div>ログイン</div>;
}
