//画面の「中身の幅」と「左右の余白」を決める部品

import type { ReactNode } from "react";

//mx-auto max-w-sm：幅の上限を決めて、中央に置く(PCで見ても細い列になる)
//w-full：スマホなど、上限より狭い画面では、横幅いっぱいに使う
//px-8：左右の余白(上限の幅の「内側」に付くので、中身の幅は、384-64=320px)
export default function Container({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-sm px-8">{children}</div>;
}
