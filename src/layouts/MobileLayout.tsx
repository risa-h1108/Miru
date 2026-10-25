import type { ReactNode } from "react";

export default function MobileLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <header>Header</header>

      <main>{children}</main>

      <footer>BottomTab</footer>
    </div>
  );
}
