import { NavLink } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="logo">BankUI</div>
      <nav className="nav">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
          Home
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>
          About
        </NavLink>
        <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active' : '')}>
          Contact
        </NavLink>
        <NavLink to="/services" className={({ isActive }) => (isActive ? 'active' : '')}>
          Services
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;