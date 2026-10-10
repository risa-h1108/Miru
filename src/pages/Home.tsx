//トップページ画面（アプリ紹介やログイン・ゲストログイン機能）

import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h1>Miru</h1>
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
      <Link to="/action">ゲストとして始める</Link>
    </div>
  );
}
