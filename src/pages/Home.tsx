//トップページ画面（アプリ紹介やログイン・ゲストログイン機能）

import Header from "../components/Header";
import Button from "../components/Button";
import { useGuestLogin } from "../hooks/useGuestLogin";
import { Icon } from "@iconify/react";
import Container from "../components/Container";

//「使い方」の1ステップ分のデータの型
// ※番号(1,2,3,4)はデータに持たせず、配列の順番(index)から作る
//   → 順番を入れ替えたとき、番号の直し忘れが起きない
type Step = {
  title: string; //ステップのタイトル(太字の1行目)
  description: string; //ステップの説明(小さい灰色の2行目)
};

//「使い方」の4ステップ分のデータ
// ※画面の中身が変わらない固定データなので、コンポーネントの「外」に書く
//   中に書くと、画面が更新される度に、配列が毎回作り直されてしまうため
const steps: Step[] = [
  {
    title: "行動を選ぶ",
    description: "今日やろうとしていたことを選択しよう。",
  },
  {
    title: "やらない理由を選ぶ",
    description: "疲れ、不安、時間...正直に選ぼう。",
  },
  {
    title: "後で振り返る",
    description: "あのとき本当に後悔した？を記録しよう。",
  },
  {
    title: "傾向を見る",
    description: "後悔しやすいパターンが見えてくる。",
  },
];

export default function Home() {
  //ゲストボタン、ゲストログインエラーを管理するフック
  const { handleGuest, guestError } = useGuestLogin();

  return (
    <div>
      <Container>
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
      </Container>

      {/* 使い方の白い帯 */}
      {/* <section>：「ひとまとまりの内容」を表すタグ
          mt-10：上半分の最後のボタンとの間の余白
          bg-white：背景は、画面の端から端まで白(外側の<div>にpxが無いので、端まで広がる)
          py-6：帯の中の、上下の余白 */}
      <section className="mt-10 bg-white py-6">
        <Container>
          <h2 className="text-center text-[14px] font-bold text-[#3D3058]">
            使い方はシンプルです
          </h2>

          {/* <ol>：番号つきの並び(順番に意味があるので、<ul>ではなく<ol>)
            ※Tailwindの初期設定で、<ol>の「1. 2. 3.」の表示は消えている
              (番号は、下で自分で作った四角に出す) */}

          {/* mx-auto：余った左右の余白を自動で割り振り、中央に置く
            ※max-wで上限を決めないと、mx-autoは余りが無く、中央にならない */}
          <ol className="mx-auto mt-4 max-w-57.5">
            {/* steps.map(...)：配列の1つ1つ(step)を、順番に<li>へ変換して、4つ並べる
              index：その要素が何番目か(0から始まる)
              key={step.title}：Reactが「どの<li>がどれか」を見分けるための目印
                ※配列の中で重ならない値を使うため */}
            {steps.map((step, index) => (
              //flex items-center：番号の四角と、文字を、横並びにして、縦の中央をそろえる
              //gap-3：四角と文字の間の余白
              //border-b：下に細い線(行どうしの区切り)
              //last:border-b-0：最後の1つだけ、線を消す(下の余白に、線が出ないように)
              <li
                key={step.title}
                className="flex items-center gap-3 border-b border-[#F0EBFF] py-3 last:border-b-0"
              >
                {/* 番号の四角
                  h-7 w-7：縦横28pxの正方形
                  shrink-0：横幅が足りなくても、四角が縮まないようにする
                  flex items-center justify-center：中の番号を、縦も横も中央に置く */}
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F0EBFF] text-[12px] font-bold text-[#799EFF]">
                  {/* index + 1：indexは0から始まるので、+1して「1,2,3,4」にする */}
                  {index + 1}
                </span>

                {/* タイトルと説明を、縦に並べる(<div>で2つを1かたまりにする) */}
                <div>
                  <p className="text-[13px] font-bold text-[#3D3058]">
                    {step.title}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#9B8FB5]">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* 下のCTA:薄紫の帯 */}
      {/* text-center：中の文を、中央に寄せる */}
      <section className="bg-[#F0EBFF] py-6 text-center">
        <Container>
          <p className="mt-3">
            記録は1分で完了。
            <br />
            まずは「1週間」、試してみてください。
          </p>

          {/* Buttonは「w-full(横幅いっぱい)」なので、そのままだと帯の端まで広がるため、
            幅を決めた<div>で包んで、中央(mx-auto)に置く。 */}
          <div className="mx-auto mt-4 w-60">
            <Button variant="primary" to="/signup">
              無料で始める
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
