import { useState } from "react";
//import { useNavigate } from "react-router-dom";
import type { Category, ContactFormValues } from "../types";
import Container from "../components/Container";
import Header from "../components/Header";

//コンポーネントの外に書く(固定データなので、毎回作り直さないため)
const categories: Category[] = [
  { value: "usage", label: "使い方について" },
  { value: "bug", label: "不具合の報告" },
  { value: "request", label: "機能のご要望" },
  { value: "feedback", label: "ご感想" },
  { value: "work", label: "お仕事のご相談" },
  { value: "other", label: "その他" },
];

export default function Contact() {
  //処理のあとで移動するので、Link ではなくuseNavigateを使用
  //const navigate = useNavigate();

  //名前、メールアドレス、種別、内容を1つのstateに纏める
  const [form, setForm] = useState<ContactFormValues>({
    name: "", // 名前欄の初期値(空文字)
    email: "", // メールアドレス欄の初期値(空文字)
    category: "", // 種別欄の初期値(空文字)
    contents: "", // 問い合わせ内容欄の初期値(空文字)
  });

  //エラー文を管理するstate。nullなら「エラーなし」の意味。
  // 画面に出す値なので、送信の結果(成功or失敗)によって変化するstateで記載
  //const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return (
    <Container>
      <Header />
      <h1 className="mb-2 text-center text-[22px] text-[#3D3058] font-semibold">
        お問い合わせ
      </h1>
      <p className="mb-6 text-[13px] text-[#9B8FB5]">
        ご質問・ご要望などお気軽にご連絡ください。
      </p>

      {/* お名前のlabel */}
      <label
        htmlFor="name"
        //block:入力欄の上に出す
        //font-semibold:フォントの太さをセミボールド(やや太め)にする
        className="block mb-2 text-xs font-semibold text-[#3D3058]"
      >
        お名前
      </label>

      {/* お名前の入力欄 */}
      <input
        id="name"
        type="text"
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

      {/* メールアドレスのlabel */}
      <label
        htmlFor="email"
        className="block mb-2 text-xs font-semibold text-[#3D3058]"
      >
        メールアドレス
      </label>

      {/*メールアドレスの入力欄 */}
      <input
        id="email"
        type="email"
        className="w-full px-4 mb-3 text-sm h-12 rounded-xl text-[#3D3058] bg-white border-[1.5px] border-[#EDE6FA] placeholder:text-[#C5B8DC]"
        value={form.email}
        //placeholder:入力前の薄い文字
        placeholder="example@mail.com"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      {/* お問い合わせ種別のlabel */}
      <label
        htmlFor="category"
        className="block mb-2 text-xs font-semibold text-[#3D3058]"
      >
        お問い合わせ種別
      </label>

      {/* お問い合わせ種別の入力欄 （<select>でプルダウンにする ）*/}
      <select
        id="category"
        className="w-full px-4 mb-3 text-sm h-12 rounded-xl text-[#3D3058] bg-white border-[1.5px] border-[#EDE6FA]"
        //form.categoryが未選択の場合、下の「選択してください」が表示される
        value={form.category}
        //categoryだけ更新する
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      >
        {/* 未選択時の初期表示用。
        　　disabled：この項目は選択できない(案内用) */}
        <option value="" disabled>
          選択してください
        </option>

        {/* .map()で[配列の1件ごとに<option>を1つ付ける]処理を実施 */}
        {/* (opt) =>: 取り出した1件の呼び名。{ value: "bug", label: "不具合の報告" } のようなものが入る。*/}
        {categories.map((opt) => (
          //key={opt.value}: Reactが「どれがどれか」を見分けるための目印
          //value={opt.value}: プログラム用の値(="bug")
          <option key={opt.value} value={opt.value}>
            {/* 画面に見せる文字(="不具合の報告") */}
            {opt.label}
          </option>
        ))}
      </select>

      {/* お問い合わせ内容のlabel */}
      <label
        htmlFor="contents"
        className="block mb-2 text-xs font-semibold text-[#3D3058]"
      >
        お問い合わせ内容
      </label>

      {/* お問い合わせ内容の入力欄 */}
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
