//ボタンのコンポーネント

import type { ReactNode } from "react";
import { Link } from "react-router-dom";

//variantに入れられる値を3つだけに限定する(型定義)
//色の名前(blueなど)ではなく役割の名前にすることで、色を変えても名前が嘘にならない
type Variant = "primary" | "secondary" | "guest";

//Buttonコンポーネントが使う側(Home.tsxなど)から受け取る値(props)の型定義
type ButtonProps = {
  variant: Variant; //色の種類(必須)
  children: ReactNode; //<Button>ここに書いた中身</Button> が入る(ボタンの文字)
  onClick?: () => void; //押されたときの処理。? は「渡さなくてもよい」の意味
  to?: string; //移動先のURL。渡さなくてもよい
};

//色・文字の大きさ・太さを[種類(variant)ごと]に1か所でまとめる
//Record<Variant, string> :「キーの種類(Variant["primary"or"secondary"or"guest"])と
//　　値の種類(string[文字列])を決めた対応表(primary: string;のよう)の型
const variantClasses: Record<Variant, string> = {
  //青(メイン)：新規登録・ログイン・送信など
  primary: "bg-[#799EFF] text-white text-[15px] font-semibold",

  //白地に枠線：Homeの「ログイン」
  secondary:
    "bg-white text-[#799EFF] border-[1.5px] border-[#EDE6FA] text-[15px] font-semibold",

  //薄いオレンジ：「ゲストとして試す」など
  guest: "bg-[#FFE8D6] text-[#3D3058] text-sm font-medium",
};

//{ variant, children, onClick }：使う側(Home.tsxなど)から受け取ったpropsを取り出す書き方
export default function Button({
  variant,
  children,
  onClick,
  to,
}: ButtonProps) {
  //共通の形+種類ごとの色を、1つの文字列にまとめる
  // ※Linkとbuttonのどちらにも使うので、1か所だけに書く

  // [共通の形]
  //  flex items-center justify-center：中の文字を、縦も横も中央に置く
  //   (<a>は初期状態で行の中の文字扱いのため、高さ(h-13)が効かず、文字も中央に来ない。
  //    flexにすると、<a>も<button>と同じ見た目になる)
  //  w-full h-13 rounded-2xl：横幅いっぱい・高さ52px・角丸16px(全種類で共通)

  // [種類ごとの色]
  //  variantClasses[variant]：渡された種類("primary"など)に合うクラスの文字列を取り出して、
  //  [色・文字の大きさ・太さ]を付ける
  const buttonClassName = `flex items-center justify-center w-full h-13 rounded-2xl ${variantClasses[variant]}`;

  //toが渡されたら、Link(ページ移動)を返す
  if (to) {
    return (
      //to={to}：受け取った移動先(例: "/signup")を、Linkにそのまま渡す
      <Link to={to} className={buttonClassName}>
        {children}
      </Link>
    );
  }

  //渡されなければ、今までどおりのbuttonを返す
  return (
    <button onClick={onClick} className={buttonClassName}>
      {/* children：<Button>ここ</Button> に書いた中身(ボタンの文字)が入る */}
      {children}
    </button>
  );
}
