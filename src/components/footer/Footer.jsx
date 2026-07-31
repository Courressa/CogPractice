import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="footer-mark" aria-hidden="true">
                B
              </span>
              <span>
                Bank<span className="brand-accent">UI</span>
              </span>
            </div>
            <p>
              Secure, modern banking for individuals and businesses. Open accounts,
              manage customers, and bank with confidence.
            </p>
          </div>

          <div className="footer-col">
            <h4>Explore</h4>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
              <li>
                <Link to="/login">Sign in</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact</h4>
            <ul className="footer-contact">
              <li>1-800-555-BANK</li>
              <li>support@bankui.example</li>
              <li>
                100 Finance Plaza
                <br />
                Suite 400, Metro City
              </li>
              <li>Mon–Fri · 8:00 AM – 6:00 PM</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {year} BankUI. All rights reserved.</span>
          <span className="footer-note">Demo UI · Not a real financial institution</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
