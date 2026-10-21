//トップページ画面（アプリ紹介やログイン・ゲストログイン機能）

import { Link } from "react-router-dom";
import Header from "../components/Header";
import Button from "../components/Button";
import { useGuestLogin } from "../hooks/useGuestLogin";
import { Icon } from "@iconify/react";

export default function Home() {
  //ゲストボタン、ゲストログインエラーを管理するフック
  const { handleGuest, guestError } = useGuestLogin();

  return (
    <div>
      {/* showBackLink={false}：「← ホームに戻る」だけを隠し、それ以外のHeaderは表示する */}
      <Header showBackLink={false} />

      <h2>「やらない理由」を直していく</h2>
      <p>
        やらなかった理由を記録し、後で振り返ることで、
        <br />
        後悔しやすいパターンに気づき、
        <br />
        少しずつ改善していくための習慣化サポートアプリ
      </p>
      <Link to="/login">ログイン</Link>
      <Link to="/signup">新規登録</Link>

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
    </div>
  );
}
