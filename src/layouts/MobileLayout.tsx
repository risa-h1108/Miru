export default function MobileLayout({ children }) {
  return (
    <div>
      <header>Header</header>

      <main>{children}</main>

      <footer>BottomTab</footer>
    </div>
  );
}
