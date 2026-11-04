import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { AuthFormValues } from "../types";
import { supabase } from "../lib/supabase";
import Header from "../components/Header";
import { Icon } from "@iconify/react";
import Button from "../components/Button";
import { useGuestLogin } from "../hooks/useGuestLogin";
import Container from "../components/Container";

export default function Signup() {
  //処理のあとで移動するので、Link ではなくuseNavigateを使用
  const navigate = useNavigate();

  //メールとパスワードを1つのstateに纏める
  const [form, setForm] = useState<AuthFormValues>({
    email: "", // メール欄の初期値(空文字)
    password: "", // パスワード欄の初期値(空文字)
  });

  //エラー文を管理するstate。nullなら「エラーなし」の意味。
  // 画面に出す値なので、新規登録の結果(成功or失敗)によって変化するstateで記載
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  //ゲストボタン、ゲストログインエラーを管理するフック
  const { handleGuest, guestError } = useGuestLogin();

  //新規登録ボタンが押された時、入力されていたemail,passwordをsupabaseに保存する処理
  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    //失敗(エラーあり)の場合：画面遷移せず、エラー文を管理するstateにエラーメッセージを入れて、画面に表示させる
    if (error) {
      setErrorMessage(
        "登録に失敗しました。\n「メールアドレスの形式」と、「パスワードが英数字を含む8文字以上」かを確認してください",
      );
      return; // ここで終了(下の移動は実行しない)
    }

    //成功の場合：エラー文をnullとして、表示せずに「/action」へ移動する
    setErrorMessage(null);
    navigate("/action");
  };

  return (
    <Container>
      <Header />
      <h1 className="mb-2 text-center text-[22px] text-[#3D3058] font-semibold">
        新規登録
      </h1>
      <p className="mb-6 text-[13px] text-[#9B8FB5]">
        アカウントを作って、自分の傾向を記録しよう！
      </p>

      <label
        htmlFor="email"
        //block:入力欄の上に出す
        //font-semibold:フォントの太さをセミボールド(やや太め)にする
        className="block mb-2 text-xs font-semibold text-[#3D3058]"
      >
        メールアドレス
      </label>

      <input
        id="email"
        type="email"
        //border-[○○ px]:境界線の太さを○○ pxにする
        //placeholder:text-[#○○]：プレースホルダー(入力前の薄い文字)の文字色をつける
        className="w-full px-4 mb-3 text-sm h-12 rounded-xl text-[#3D3058] bg-white border-[1.5px] border-[#EDE6FA] placeholder:text-[#C5B8DC]"
        value={form.email}
        //placeholder:入力前の薄い文字
        placeholder="example@mail.com"
        //onChange：文字が打たれるたびに呼ばれる
        //e.target.value：そのとき入力欄に入っている文字列
        //...form：...で既存の中身を全部コピーし、パスワードなど他の値を残したまま、
        // 　　　　emailだけをe.target.valueの文字列に更新する
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <label
        htmlFor="password"
        //block:入力欄の上に出す
        //font-semibold:フォントの太さをセミボールド(やや太め)にする
        className="block mb-2 text-xs font-semibold text-[#3D3058]"
      >
        パスワード
      </label>

      <input
        id="password"
        //type="password"にすると、入力された文字表示が「●」で隠れる
        type="password"
        //border-[○○ px]:境界線の太さを○○ pxにする
        //placeholder:text-[#○○]：プレースホルダー(入力前の薄い文字)の文字色をつける
        className="w-full px-4 text-sm h-12 rounded-xl text-[#3D3058] bg-white border-[1.5px] border-[#EDE6FA] placeholder:text-[#C5B8DC]"
        value={form.password}
        placeholder="8文字以上で入力"
        //onChange：文字が打たれるたびに呼ばれる
        //e.target.value：そのとき入力欄に入っている文字列
        //...form：...で既存の中身を全部コピーし、emailなど他の値を残したまま、
        // 　　　　passwordだけをe.target.valueの文字列に更新する
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      {/* パスワードの要件(ヒント文)：常に表示　*/}
      {/* ルールは Supabase の設定(英数字を含む8文字以上)と合わせる */}
      <p className="mt-2 text-[11px] text-[#9B8FB5]">英数字を含む8文字以上</p>

      {/* エラーメッセージがあるなら(=エラーなら)、赤字でエラーメッセージを表示する */}
      {/* &&：「左が成り立つなら、右を表示する」の意味 */}
      {errorMessage && (
        <p
          role="alert" //role:あとから出るエラー文を出た瞬間に読み上げさせる合図
          //whitespace-pre-line：文字の中の \n を改行として表示する
          //mt-2：パスワードの要件文の下に出す。エラーがないときは、この要素ごと存在しない
          //flex items-start：アイコンと文字を横に並べて、2行になっても1行目の高さにアイコンをそろえる
          className="mt-2 text-[11px] flex items-start gap-0.5 whitespace-pre-line text-[#FF7B7B]"
        >
          {/* 色はつけず、親の<p>の文字色(#FF7B7B)を引き継ぐ */}
          {/* shrink-0：長い文字に押されても、アイコンが縮まないようにする
              mt-1:アイコンと文字の位置を合わせるためにアイコンを下げた */}
          <Icon icon="fluent:warning-16-filled" className="shrink-0 mt-1" />
          {errorMessage}
        </p>
      )}

      {/* 新規登録ボタン */}
      {/* mt-5：エラーの有無で間隔を変えない為、ボタンの上の余白を下記のdivタグで保持。 */}
      <div className="mt-5">
        {/* ボタンを押したらsupabaseへemail,passwordを登録する処理が実施される */}
        <Button variant="primary" onClick={handleSignup}>
          アカウントを作成
        </Button>
      </div>

      {/* または */}
      <p className="mt-3 text-center text-xs text-[#9B8FB5]">または</p>

      {/* ゲストボタン：押すと匿名サインイン(=handleGuestが作動)して「/action」へ移動する */}
      <div className="mt-3">
        <Button variant="guest" onClick={handleGuest}>
          ゲストとして試す
        </Button>

        {/* ゲストエラーは、ゲストボタンの下に出す */}
        {guestError && (
          <p
            role="alert"
            className="mt-2 text-[11px] flex items-center gap-0.5 text-[#FF7B7B]"
          >
            {/* 色はつけず、親の<p>の文字色(#FF7B7B)を引き継ぐ */}
            <Icon icon="fluent:warning-16-filled" />
            {guestError}
          </p>
        )}
      </div>

      {/* ログインへの案内 */}
      <div className="mt-3 text-center text-xs text-[#9B8FB5]">
        <p>すでにアカウントをお持ちの方は</p>
        {/* block：Linkは横並びの部品で、上下の余白(mt-/mb-)が効かないため、
        　　　　　　横幅いっぱいの行(block)にしてmt-1を効かせる */}
        <Link to="/login" className="block mt-1 text-[#799EFF] font-semibold">
          ログイン
        </Link>
      </div>
    </Container>
  );
}
