import { useState } from "react";
import type { AuthFormValues } from "../types";

export default function Login() {
  //メールとパスワードを1つのstateに纏める
  const [form, setForm] = useState<AuthFormValues>({
    email: "", // メール欄の初期値(空文字)
    password: "", // パスワード欄の初期値(空文字)
  });

  return (
    <div>
      <h1>ログイン</h1>
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
    </div>
  );
}
