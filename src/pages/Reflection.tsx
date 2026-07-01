//振り返り画面
import { Link } from "react-router-dom";

export default function Reflection() {
  return (
    <div>
      <div className=" max-w-sm mx-auto mt-3 ">
        <h1 className="text-[24px] text-center">振り返り</h1>
      </div>
      <Link to="/analysis" />
    </div>
  );
}
