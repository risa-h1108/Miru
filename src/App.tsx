"use client";

import "./App.css";
import { useRouter } from "next/navigation";

export default function App() {
  const router = useRouter();
  const nextHandle = () => {
    router.push("/actionChoice");
  };

  return (
    <div>
      <button onClick={nextHandle}>ダッシュボードへ移動</button>
      Miru
    </div>
  );
}
