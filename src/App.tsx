//画面構成（どのURLでどの画面を出すか）を記載

import "./App.css";
import ActionChoice from "./pages/ActionChoice";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Reflection from "./pages/Reflection";
import Analysis from "./pages/Analysis";
import ReasonsChoice from "./pages/ReasonsChoice";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Contact from "./contact/Contact";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import AppLayout from "./layout/AppLayout";
import ContainerLayout from "./layout/ContainerLayout";

export default function App() {
  return (
    <>
      <Routes>
        {/* Home：帯が端まで広がるので、自分でContainerを持つ */}
        <Route path="/" element={<Home />} />

        {/* それ以外：ContainerLayoutで包み、同一の幅や余白にする */}
        <Route element={<ContainerLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/contact" element={<Contact />} />

          {/* ログイン済みかどうかを見張る */}
          <Route element={<ProtectedRoute />}>
            {/* 下記のページにて、ヘッダーとタブバー付きの見た目にする */}

            <Route element={<AppLayout />}>
              {/* 各ページ */}
              <Route path="/action" element={<ActionChoice />} />
              <Route path="reasons" element={<ReasonsChoice />} />
              <Route path="reflection" element={<Reflection />} />
              <Route path="analysis" element={<Analysis />} />
            </Route>
          </Route>
        </Route>
      </Routes>

      {/* トースト通知の表示場所：アプリ全体で1か所の為、App.tsxの「<Routes>の外」に記載。
      　　　　　　　　　　　　　　ページを移動しても消えない位置に置く */}
      <ToastContainer position="top-center" />
    </>
  );
}
