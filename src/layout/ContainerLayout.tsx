//全画面の「中身の幅」と「左右の余白」を、1か所で揃えるためのレイアウト
//Container(幅と余白を決める部品)で、Outlet(各画面が入る場所)を包む

import { Outlet } from "react-router-dom";
import Container from "./Container";

export default function ContainerLayout() {
  return (
    <Container>
      <Outlet /> {/* ここに、Route で指定した各画面が入る */}
    </Container>
  );
}
