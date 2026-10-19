import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

type HeaderProps = {
  //　? ：「渡さなくてもよい」の意味
  showBackLink?: boolean; //戻るリンクを表示するか
  showLoginStatus?: boolean; //右上のログイン状態を表示するか
};

export default function Header({
  showBackLink = true, //渡されなかった場合の初期値(=true)
  showLoginStatus = true,
}: HeaderProps) {
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
          {/* showLoginStatusが「true」のときだけ、「ログイン状態」を表示する */}
          {showLoginStatus && (
            <div className="font-semibold text-[#9B8FB5]">ログイン</div>
          )}
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
