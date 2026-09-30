//トップページ画面（アプリ紹介やログイン・ゲストログイン機能）

import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h1>Miru</h1>
      <h2>アプリ紹介・ログイン画面</h2>
      <Link to="/action">ゲストとして始める</Link>
    </div>
  );
}
