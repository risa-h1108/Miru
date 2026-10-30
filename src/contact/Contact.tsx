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
    email: "", // メールアドレス欄の初期値(空文字)
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

      <label
        htmlFor="name"
        //block:入力欄の上に出す
        //font-semibold:フォントの太さをセミボールド(やや太め)にする
        className="block mb-2 text-xs font-semibold text-[#3D3058]"
      >
        お名前
      </label>

      <input
        id="name"
        type="name"
        //border-[○○ px]:境界線の太さを○○ pxにする
        //placeholder:text-[#○○]：プレースホルダー(入力前の薄い文字)の文字色をつける
        className="w-full px-4 mb-3 text-sm h-12 rounded-xl text-[#3D3058] bg-white border-[1.5px] border-[#EDE6FA] placeholder:text-[#C5B8DC]"
        value={form.name}
        //placeholder:入力前の薄い文字
        placeholder="山田 太郎"
        //onChange：文字が打たれるたびに呼ばれる
        //e.target.value：そのとき入力欄に入っている文字列
        //...form：...で既存の中身を全部コピーし、他の値を残したまま、
        // 　　　　nameだけをe.target.valueの文字列に更新する
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <label
        htmlFor="email"
        className="block mb-2 text-xs font-semibold text-[#3D3058]"
      >
        メールアドレス
      </label>

      <input
        id="email"
        type="email"
        className="w-full px-4 mb-3 text-sm h-12 rounded-xl text-[#3D3058] bg-white border-[1.5px] border-[#EDE6FA] placeholder:text-[#C5B8DC]"
        value={form.email}
        //placeholder:入力前の薄い文字
        placeholder="example@mail.com"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <label
        htmlFor="contents"
        className="block mb-2 text-xs font-semibold text-[#3D3058]"
      >
        お問い合わせ内容
      </label>

      <textarea
        id="contents"
        name="contents"
        //rows={6}：最初の高さを{}の行分確保する
        rows={6}
        //resize-y：縦方向に広げられるようにする
        className="w-full px-4 py-3 mb-3 text-sm rounded-xl text-[#3D3058] bg-white border-[1.5px] border-[#EDE6FA] placeholder:text-[#C5B8DC] resize-y"
        value={form.contents}
        placeholder="ご質問内容をご記入ください。"
        onChange={(e) => setForm({ ...form, contents: e.target.value })}
      />
    </Container>
  );
}
