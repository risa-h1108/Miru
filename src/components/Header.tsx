import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

type HeaderProps = {
  //　? ：「渡さなくてもよい」の意味
  showBackLink?: boolean; //戻るリンクを表示するか
  showLoginStatus?: boolean; //右上のログイン状態を表示するか
};

export default function Header({
  showBackLink = true, //渡されなかった場合の初期値(=true)
  showLoginStatus = true,
}: HeaderProps) {
  //ログイン状態を取得する
  //  session：ログイン中のセッション情報(未ログインならnull)
  //  isLoading：判定中かどうか(true/false)
  const { session, isLoading } = useAuth();

  return (
    <div>
      {/* 1段目：ロゴ(左)とお問い合わせ・ログイン状態(右) */}

      {/* justify-between:最初を左端、最後を右端に離す。 */}
      <div className="mt-4 mb-4 flex justify-between items-center">
        {/* ロゴ */}
        {/* ロゴのタグは<div>や<p>にして、各ページの見出しを<h1>になるようにする */}
        <p className="text-[22px] font-bold">
          <span className="text-[#3D3058]">Mi</span>
          <span className="text-[#799EFF]">ru</span>
        </p>

        {/* 右側：問い合わせ、ログイン状態 */}
        <div className="flex items-center gap-3">
          {/* アイコンだけで文字がないので、aria-labelで「名前(これは何か)」を伝える */}
          <Link to="/contact" aria-label="お問い合わせ">
            <Icon
              icon="fluent:mail-32-regular"
              className="text-[22px] text-[#9B8FB5]"
            />
          </Link>

          {/* 次の2つの条件が「両方」とも成り立つときだけ、()内部に記載したログイン状態を表示する
                ・showLoginStatusが「true(表示する設定)」
                ・!isLoading(＝判定が終わっている)

             判定中は何も表示しないことで「ログイン」から「ログアウト」への切り替わりが見えるのを防ぐ */}

          {showLoginStatus &&
            !isLoading &&
            //[条件 ? A : B]：条件が成り立てば[A]、成り立たなければ[B]を表示する
            (session ? (
              //ログイン中の場合：「ログアウト」ボタンとして表示
              <button type="button" className="font-semibold text-[#9B8FB5]">
                ログアウト
              </button>
            ) : (
              //未ログインの場合：「ログイン」ページへ移動するリンクとして表示
              <Link to="/login" className="font-semibold text-[#9B8FB5]">
                ログイン
              </Link>
            ))}
        </div>
      </div>

      {/* 2段目：戻るリンク */}

      {/* showBackLinkが「true」のときだけ、「ホームに戻る」を表示する */}
      {showBackLink && (
        //block：横幅いっぱいの行にする
        <Link to="/" className="block mb-1 text-[13px] text-[#9B8FB5]">
          ← ホームに戻る
        </Link>
      )}
    </div>
  );
}
