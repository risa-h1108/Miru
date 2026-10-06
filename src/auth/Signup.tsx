import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AuthFormValues } from "../types";

export default function Signup() {
  //処理のあとで移動するので、Link ではなくuseNavigateを使用
  const navigate = useNavigate();

  //メールとパスワードを1つのstateに纏める
  const [form, setForm] = useState<AuthFormValues>({
    email: "", // メール欄の初期値(空文字)
    password: "", // パスワード欄の初期値(空文字)
  });

  return <div>新規登録</div>;
}
