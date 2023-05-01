export function Footer() {
  const dateYear = new Date().getFullYear();
  return (
    <footer className="footer">
      <p className="footer__copyright">&copy; {dateYear} Around The U.S.</p>
    </footer>
  );
}
