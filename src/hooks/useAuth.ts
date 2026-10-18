import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

//ログイン状態を取得して返すカスタムフック
export function useAuth() {
  //session：ログイン中なら中身あり、未ログインならnull
  // Session(@supabase/supabase-js)：Supabaseのログイン中の情報(トークンやユーザー)を管理している型
  const [session, setSession] = useState<Session | null>(null);

  //isLoading：ログイン状態の判定が終わっているかどうか(入れる値は「true」か「false」)
  //初期値を true にする理由：判定の結果が出る前に「未ログイン」と誤って判断されないようにする為
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    //1.最初の状態を1回取得
    // getSession():「今この瞬間」の保存済みのセッションを現時点で1回取得する
    // .then(...):取得が完了したあとに、この中の処理を実行する
    // 受け取った { data } の中身は、{ session: ... } の形。
    //　 └sessionがnullなら未ログイン。値があればログイン済み。
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session); //上で受け取ったdataの中のsessionをsetSessionに入れる
      setIsLoading(false); //取得が完了したので、「確認中」の状態を解除する
    });

    //2.ログイン・ログアウトなどの変化を監視(=変化が起きるたびに呼ばれる)

    // onAuthStateChange():ログイン・ログアウトなどの変化が起きるたびに、渡した関数を実行する
    // _event：変化の種類(ログイン・ログアウトなど)を表す引数。この処理では使わない。
    //   ただし、2番目の引数「newSession」を受け取るには、1番目の位置に引数が必要なため、
    //   名前を付けて受け取っている。先頭の「_」は「使わない引数」を示す。
    // newSession：変化後の最新のセッション。ログアウトしたときは「null」になる
    // 戻り値 { data: { subscription } } から data を取り出し、
    //   「data」の中の「subscription」は、3. で監視を解除するために使う
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession); //状態を最新に置き換える
    });

    //3.画面が消えるとき、監視をやめる(クリーンアップ)
    //　└useEffectの中で「return」した関数は、そのコンポーネントが画面から消えるときに実行される
    // subscription：2. で開始した監視を管理するオブジェクト(onAuthStateChange() の戻り値に含まれる)
    // unsubscribe()：「subscription」に備わっている、監視を解除するための関数
    return () => data.subscription.unsubscribe();
  }, []); // 第2引数 []：この処理を最初の1回だけ実行する指定

  //useAuth の戻り値：
  //  session(ログイン中ならセッション、未ログインなら null)
  //  isLoading(ログイン状態を判定中かどうか)
  return { session, isLoading };
}
