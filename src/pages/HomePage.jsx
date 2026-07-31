import { Link } from 'react-router-dom';
import './HomePage.css';

const features = [
  {
    title: 'Checking & Savings',
    description:
      'Everyday accounts with no hidden fees, competitive rates, and instant mobile access to your balances.',
    icon: '💰',
  },
  {
    title: 'Personal Loans',
    description:
      'Flexible financing for life’s milestones — from home improvements to education — with clear terms.',
    icon: '🏠',
  },
  {
    title: 'Secure Online Banking',
    description:
      'Bank anytime with multi-factor security, real-time alerts, and full visibility into your accounts.',
    icon: '🔒',
  },
  {
    title: 'Customer Support',
    description:
      'Talk to real people when you need them. Branch, phone, and digital support seven days a week.',
    icon: '🤝',
  },
];

const stats = [
  { value: '120+', label: 'Branch locations' },
  { value: '2M+', label: 'Customers served' },
  { value: '99.9%', label: 'Platform uptime' },
  { value: '24/7', label: 'Digital access' },
];

function HomePage() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <p className="hero-eyebrow">Trusted community banking</p>
            <h1>Banking that puts people first</h1>
            <p className="hero-lead">
              Open accounts, manage customers, and handle everyday banking with a
              modern platform built for clarity, security, and speed.
            </p>
            <div className="btn-group hero-actions">
              <Link to="/register" className="btn btn-primary">
                Open an account
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Sign in
              </Link>
            </div>
          </div>
          <div className="hero-panel card" aria-hidden="true">
            <div className="hero-panel-label">Account overview</div>
            <div className="hero-balance">
              <span>Available balance</span>
              <strong>$24,580.42</strong>
            </div>
            <div className="hero-mini-stats">
              <div>
                <span>Checking</span>
                <strong>$8,240.15</strong>
              </div>
              <div>
                <span>Savings</span>
                <strong>$16,340.27</strong>
              </div>
            </div>
            <div className="hero-tx">
              <div className="hero-tx-row">
                <span>Payroll deposit</span>
                <span className="positive">+$3,200.00</span>
              </div>
              <div className="hero-tx-row">
                <span>Utility payment</span>
                <span>−$142.50</span>
              </div>
              <div className="hero-tx-row">
                <span>Transfer to savings</span>
                <span>−$500.00</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page home-section">
        <div className="section-heading">
          <h2>Everything you need from a bank</h2>
          <p>Products and tools designed for everyday life and growing businesses.</p>
        </div>
        <div className="grid-4 feature-grid">
          {features.map((feature) => (
            <article key={feature.title} className="card feature-card">
              <div className="feature-icon" aria-hidden="true">
                {feature.icon}
              </div>
              <h3 className="card-title">{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="stats-strip">
        <div className="page stats-inner">
          <div className="section-heading light">
            <h2>Why customers choose BankUI</h2>
            <p>Numbers that reflect our commitment to reliable, accessible banking.</p>
          </div>
          <div className="grid-4 stats-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-item">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page home-section">
        <div className="cta-banner card">
          <div>
            <h2>Ready to get started?</h2>
            <p>
              Create your customer account or sign in to manage your banking profile.
              Prefer to talk first? Reach out to our team anytime.
            </p>
          </div>
          <div className="btn-group">
            <Link to="/register" className="btn btn-primary">
              Create account
            </Link>
            <Link to="/about" className="btn btn-secondary">
              Learn About Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
