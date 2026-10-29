import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ContactFormValues } from "../types";

export default function Contact() {
  //処理のあとで移動するので、Link ではなくuseNavigateを使用
  const navigate = useNavigate();

  //名前、メールアドレス、種別、内容を1つのstateに纏める
  const [form, setForm] = useState<ContactFormValues>({
    name: "", // 名前欄の初期値(空文字)
    mail: "", // メールアドレス欄の初期値(空文字)
    category: "", // 種別欄の初期値(空文字)
    contents: "", // 問い合わせ内容欄の初期値(空文字)
  });

  //エラー文を管理するstate。nullなら「エラーなし」の意味。
  // 画面に出す値なので、送信の結果(成功or失敗)によって変化するstateで記載
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return <div>お問い合わせ</div>;
}
