//理由選択画面

import { Link } from "react-router-dom";
import type { Cards } from "../types";

// 理由カードの選択肢一覧
const reasonList: Cards[] = [
  { id: "tired", label: "疲れている", icon: "lucide:bed" },
  { id: "hassle", label: "面倒くさい", icon: "lucide:annoyed" },
  { id: "worried", label: "不安がある", icon: "fluent:thinking-20-regular" },
  { id: "no-time", label: "時間がない", icon: "lucide:alarm-clock-off" },
  {
    id: "priorities",
    label: "他のことを優先したい",
    icon: "lucide:briefcase",
  },
  { id: "question", label: "やり方が分からない", icon: "lucide:circle-help" },
  { id: "other", label: "その他", icon: "lucide:circle-ellipsis" },
];

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
