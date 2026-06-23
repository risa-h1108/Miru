//理由選択画面

import { Link } from "react-router-dom";

export default function Reason() {
  return (
    <div>
      <div className=" max-w-sm mx-auto mt-3 ">
        <h1 className="text-[24px] text-center">やらない理由は？</h1>
        <h2 className="text-[16px] text-center">
          当てはまるものを選んでください（複数選択OK）
        </h2>
      </div>

      <Link to="/reflection" />
    </div>
  );
}
