import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

//ログイン済みのユーザーだけが、内側のページを表示できるようにするコンポーネント
export default function ProtectedRoute() {
  const { session, isLoading } = useAuth();

  //上から順に判定していって、当てはまったところでreturnして動作を終了する

  //1.判定中：結果が出るまで(=isLoading中なら)、何も表示しない
  //   最初に確認する理由：判定中は「sessionがnull」のため、
  //     先に未ログインの確認をすると、ログイン済みでも「未ログイン」と誤って判断されるから
  if (isLoading) {
    return null; //画面への描画なし
  }

  //2.未ログインの場合：トップページ「/」へ移動する
  //　replace：移動履歴を置き換え、「戻る」操作でこのページに戻ることを防ぐ
  //　 ※ゲスト(匿名)ログインの場合でもsessionはあるため、この条件(!session)には当てはまらず、3へ進める
  if (!session) {
    return <Navigate to="/" replace />;
  }

  //3.ログイン済みの場合：内側のページ(<Route> の子要素である[/action]など)を表示する
  return <Outlet />;
}
