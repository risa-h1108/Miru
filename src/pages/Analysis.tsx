//分析画面

import { Link } from "react-router-dom";

export default function Analysis() {
  return (
    <div>
      <div className="max-w-sm mx-auto mt-3">
        <h1 className="text-[24px] text-center">分析</h1>
        <h2 className="text-[16px] text-center">あなたの傾向を分析しました</h2>
      </div>
      <Link to="/" />
    </div>
  );
}
