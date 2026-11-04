import { useState, type ComponentProps } from "react";
import type { Category, ContactFormValues } from "../types";
import Container from "../components/Container";
import Header from "../components/Header";
import Button from "../components/Button";
import { supabase } from "../lib/supabase";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";

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

  //送信中かどうかを管理するstate。連打による二重送信を防ぐために使う
  const [isSubmitting, setIsSubmitting] = useState(false);

  //送信ボタンを押されたときの処理

  //formタグのonSubmitが受け取る型を、そのまま借りる。
  // eの型は自動で決まるので、型の名前を書かなくてOK
  const handleSubmit: ComponentProps<"form">["onSubmit"] = async (e) => {
    //フォーム送信時のページ再読み込みを止める(これがないと入力内容が消える)
    e.preventDefault();

    //送信中なら、2回目以降は何もしない(ボタンが連打されても、2回保存しない)
    if (isSubmitting) return;

    //[前回の送信が失敗したときに出たエラー文]が表示されたままになっているため、
    // 今回もう一度送信した際にエラー文が不要になるので、一旦消す処理を実施
    setErrorMessage(null); // 前回のエラー文を消す
    setIsSubmitting(true); // 送信中にする

    //contactsテーブルに1行 insert(追加)する
    //[id]と[created_at]はDBが自動で入れるので、渡さない
    // ※.select()はつけない(selectの権限がなく、エラーになるため)
    const { error } = await supabase.from("contacts").insert({
      name: form.name,
      email: form.email,
      category: form.category, // value("bug" など)を保存する
      contents: form.contents,
    });

    setIsSubmitting(false); // 成功でも失敗でも、送信中を終える

    //失敗:エラー文を出して終わる(入力内容は消さない)
    if (error) {
      setErrorMessage(
        "送信に失敗しました。時間をおいて、もう一度お試しください。",
      );
      return;
    }

    //成功:お礼(toast)を出して、入力欄を空に戻す
    toast.success("送信しました。ご連絡ありがとうございました。");
    setForm({ name: "", email: "", category: "", contents: "" });
  };

  return (
    <Container>
      <Header />
      <h1 className="mb-2 text-center text-[22px] text-[#3D3058] font-semibold">
        お問い合わせ
      </h1>
      <p className="mb-6 text-[13px] text-[#9B8FB5]">
        ご質問・ご要望などお気軽にご連絡ください。
      </p>

      {/* form:入力欄と送信ボタンを「1枚の提出用紙」としてまとめる
    onSubmit:type="submit" のボタンが押され、required などのブラウザのチェックを
    通ったときに呼ばれる(チェックNGのときは呼ばれない) */}
      <form onSubmit={handleSubmit}>
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
          //required:[この欄は必須。空のままでは送信できない]の意味。
          //※空のまま送信しようとすると、ブラウザが「このフィールドを入力してください」と自動で出して、送信を止めてくれる
          required
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
          required
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
          required
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
          required
          //rows={6}：最初の高さを{}の行分確保する
          rows={6}
          //resize-y：縦方向に広げられるようにする
          className="w-full px-4 py-3 text-sm rounded-xl text-[#3D3058] bg-white border-[1.5px] border-[#EDE6FA] placeholder:text-[#C5B8DC] resize-y"
          value={form.contents}
          placeholder="ご質問内容をご記入ください。"
          onChange={(e) => setForm({ ...form, contents: e.target.value })}
        />

        <div className="mt-3">
          {/* エラーメッセージ:あるときだけ表示する */}
          {errorMessage && (
            <p
              role="alert" //role:あとから出るエラー文を出た瞬間に読み上げさせる合図
              className="mb-3 text-[11px] flex items-center gap-0.5 text-[#FF7B7B]"
            >
              {/* 色はつけず、親の<p>の文字色(#FF7B7B)を引き継ぐ */}
              <Icon icon="fluent:warning-16-filled" />
              {errorMessage}
            </p>
          )}

          {/* 送信ボタン */}
          {/* ボタンの色・文字の大きさ・太さはvariantの"primary"で決めている 
      　　　ボタンの形は、Buttonコンポーネントで決めている */}
          <Button variant="primary" type="submit">
            送信する
          </Button>
        </div>
      </form>
    </Container>
  );
}
