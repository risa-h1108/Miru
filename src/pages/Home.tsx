//トップページ画面（アプリ紹介やログイン・ゲストログイン機能）

import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h1>アプリ紹介・ログイン画面</h1>
      <Link to="/action">ゲストとして始める</Link>
    </div>
  );
}
