import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div>
      {/* block：横幅いっぱいの行にする */}
      <Link to="/" className="block mb-6 text-[13px] text-[#9B8FB5]">
        ← ホームに戻る
      </Link>

      {/* ロゴのタブは<div>や<p>にして、各ページの見出しを<h1>になるようにする */}
      <div className="text-[22px] font-bold">
        <span className="text-[#3D3058]">Mi</span>
        <span className="text-[#799EFF]">ru</span>
      </div>
    </div>
  );
}
