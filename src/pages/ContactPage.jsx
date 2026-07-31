import { useState } from 'react';
import './ContactPage.css';

const contactCards = [
  {
    title: 'Phone',
    detail: '1-800-555-BANK',
    note: 'Mon–Fri, 8:00 AM – 6:00 PM',
  },
  {
    title: 'Email',
    detail: 'support@bankui.example',
    note: 'We typically reply within one business day',
  },
  {
    title: 'Main branch',
    detail: '100 Finance Plaza, Suite 400',
    note: 'Metro City · Open weekdays',
  },
  {
    title: 'Secure message',
    detail: 'Use the form below',
    note: 'Best for account and service questions',
  },
];

function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="page contact-page">
      <header className="page-header">
        <h1>Contact us</h1>
        <p>
          Have a question about accounts, services, or customer management? Reach out —
          our team is ready to help.
        </p>
      </header>

      <section className="section">
        <div className="grid-4 contact-cards">
          {contactCards.map((item) => (
            <article key={item.title} className="card contact-card">
              <h3 className="card-title">{item.title}</h3>
              <p className="contact-detail">{item.detail}</p>
              <p className="contact-note">{item.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section contact-layout">
        <div className="card contact-form-card">
          <h2 className="section-title">Send a message</h2>
          <p className="form-intro">
            Fill out the form and we’ll get back to you. This demo form does not send
            email — it only shows a confirmation on submit.
          </p>

          {submitted && (
            <div className="banner banner-success" role="status">
              Thank you! Your message has been received. A specialist will follow up shortly.
            </div>
          )}

          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="form-grid cols-2">
              <div className="form-field">
                <label htmlFor="name">Full name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jane@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                name="subject"
                type="text"
                placeholder="How can we help?"
                value={form.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="Tell us a bit more about your question…"
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <button type="submit" className="btn btn-primary">
                Send message
              </button>
            </div>
          </form>
        </div>

        <aside className="card visit-card">
          <h2 className="section-title">Visit a branch</h2>
          <div className="map-placeholder" aria-hidden="true">
            <span>Branch map</span>
            <small>100 Finance Plaza · Metro City</small>
          </div>
          <ul className="hours-list">
            <li>
              <span>Monday – Friday</span>
              <strong>8:00 AM – 6:00 PM</strong>
            </li>
            <li>
              <span>Saturday</span>
              <strong>9:00 AM – 1:00 PM</strong>
            </li>
            <li>
              <span>Sunday</span>
              <strong>Closed</strong>
            </li>
          </ul>
          <p className="visit-note">
            Appointments recommended for lending and new business accounts.
          </p>
        </aside>
      </section>
    </div>
  );
}

export default ContactPage;
