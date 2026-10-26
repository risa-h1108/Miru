//トップページ画面（アプリ紹介やログイン・ゲストログイン機能）

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

      <h1>「やらない理由」を直していく</h1>
      <p>
        やらなかった理由を記録し、後で振り返ることで、
        <br />
        後悔しやすいパターンに気づき、
        <br />
        少しずつ改善していくための習慣化サポートアプリ
      </p>

      <div className="mt-3">
        <Button variant="primary" to="/signup">
          新規登録(無料)
        </Button>
      </div>

      <div className="mt-3">
        <Button variant="secondary" to="/login">
          ログイン
        </Button>
      </div>

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

      <p>
        記録は1分で完了。
        <br />
        まずは「3日間から」試してみてください。
      </p>

      <div className="mt-3">
        <Button variant="primary" to="/signup">
          無料で始める
        </Button>
      </div>
    </div>
  );
}
