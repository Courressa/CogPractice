import './AboutPage.css';

const values = [
  {
    title: 'Integrity',
    description:
      'We operate with transparency. Clear fees, honest advice, and decisions that put customers first.',
  },
  {
    title: 'Security',
    description:
      'Your data and deposits are protected with modern encryption, monitoring, and industry best practices.',
  },
  {
    title: 'Community',
    description:
      'We invest in the neighborhoods we serve — local lending, financial education, and long-term relationships.',
  },
  {
    title: 'Innovation',
    description:
      'Digital tools that simplify banking without losing the human touch you expect from a community bank.',
  },
];

const milestones = [
  {
    year: '1987',
    title: 'Founded',
    description: 'BankUI opened its first branch to serve local families and small businesses.',
  },
  {
    year: '2005',
    title: 'Regional growth',
    description: 'Expanded to 50+ branches across the metro corridor and surrounding communities.',
  },
  {
    year: '2016',
    title: 'Digital launch',
    description: 'Released online and mobile banking with real-time transfers and account alerts.',
  },
  {
    year: '2024',
    title: 'Next generation',
    description: 'Modernized our customer platform with faster onboarding and smarter account tools.',
  },
];

function AboutPage() {
  return (
    <div className="page about-page">
      <header className="page-header">
        <h1>About BankUI</h1>
        <p>
          We’re a community-focused bank built to make everyday banking simpler, safer,
          and more personal — whether you’re opening your first account or managing a
          growing customer base.
        </p>
      </header>

      <section className="section about-mission card">
        <h2 className="section-title">Our mission</h2>
        <p className="mission-text">
          To help people and businesses build financial confidence through clear products,
          dependable service, and technology that works the way life does — on the go,
          around the clock, and without unnecessary complexity.
        </p>
      </section>

      <section className="section">
        <h2 className="section-title">What we stand for</h2>
        <div className="grid-4">
          {values.map((value) => (
            <article key={value.title} className="card value-card">
              <h3 className="card-title">{value.title}</h3>
              <p>{value.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Our story</h2>
        <div className="card story-card">
          <p>
            BankUI began as a neighborhood bank with a simple idea: banking should feel
            approachable. Decades later, we’ve grown into a full-service institution while
            keeping that same commitment — personal service, fair products, and tools that
            make money management less stressful.
          </p>
          <p>
            Today our teams support checking and savings, lending, and digital customer
            management so staff can focus on people, not paperwork. This demo application
            showcases how a modern bank interface can present services, share our story,
            and manage customer records in one place.
          </p>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Milestones</h2>
        <ol className="timeline">
          {milestones.map((item) => (
            <li key={item.year} className="timeline-item card">
              <span className="timeline-year">{item.year}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

export default AboutPage;
