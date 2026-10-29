import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ContactFormValues } from "../types";
import Container from "../components/Container";
import Header from "../components/Header";

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

  return (
    <Container>
      <Header />
      <h1 className="mb-2 text-center text-[22px] text-[#3D3058] font-semibold">
        お問い合わせ
      </h1>
      <p className="mb-6 text-[13px] text-[#9B8FB5]">
        ご質問・ご要望などお気軽にご連絡ください。
      </p>
    </Container>
  );
}
