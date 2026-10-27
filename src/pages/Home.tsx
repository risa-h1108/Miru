//トップページ画面（アプリ紹介やログイン・ゲストログイン機能）

import Header from "../components/Header";
import Button from "../components/Button";
import { useGuestLogin } from "../hooks/useGuestLogin";
import { Icon } from "@iconify/react";

export default function Home() {
  //ゲストボタン、ゲストログインエラーを管理するフック
  const { handleGuest, guestError } = useGuestLogin();

  return (
    <div className="px-8">
      {/* showBackLink={false}：「← ホームに戻る」だけを隠し、それ以外のHeaderは表示する */}
      <Header showBackLink={false} />

      {/* ピル：見出しの上の、小さなラベル */}
      {/* inline-block:文字の幅だけ広がる
      rounded-full:4つの角すべてが、完全な丸 */}
      <p className="inline-block rounded-full bg-[#F0EBFF] mt-2 px-4 py-1.5 text-[12px] font-semibold text-[#799EFF]">
        行動改善アプリ
      </p>

      {/* 見出し */}
      <h1 className="mt-3 text-[22px] font-bold">
        <span className="text-[#3D3058]">「やらない理由」を</span>
        <br />
        <span className="text-[#799EFF]">直していく</span>
      </h1>

      <p className="mt-3 text-[13px] text-[#9B8FB5]">
        やると決めたのに、またやらなかった。
        <br />
        その「なぜ」を記録して、次の自分を変えよう。
      </p>

      <div className="mt-5">
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

      <p className="mt-3">
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
