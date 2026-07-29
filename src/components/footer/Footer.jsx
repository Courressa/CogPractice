import './Footer.css';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <span className="logo">BankUI</span>
        <span>© {year} BankUI. All rights reserved.</span>
      </div>
    </footer>
  );
}

export default Footer;