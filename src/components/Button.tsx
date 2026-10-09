//ボタンのコンポーネント

import type { ReactNode } from "react";

//variantに入れられる値を3つだけに限定する(型定義)
//役割名で色分けすることで他の名称でも使いやすくする
type Variant = "primary" | "secondary" | "guest";

//Buttonコンポーネントが使う側(Home.tsxなど)から受け取る値(props)の型定義
type ButtonProps = {
  variant: Variant; // 色の種類(必須)
  children: ReactNode; // <Button>ここに書いた中身</Button> が入る(ボタンの文字)
  onClick?: () => void; // 押されたときの処理。? は「渡さなくてもよい」の意味
};
