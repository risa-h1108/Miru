//画面の「中身の幅」と「左右の余白」を決める部品

import type { ReactNode } from "react";

//mx-auto max-w-sm：幅の上限を決めて、中央に置く(PCで見ても細い列になる)
//w-full：スマホなど、上限より狭い画面では、横幅いっぱいに使う
export default function Container({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-sm px-6">{children}</div>;
}
