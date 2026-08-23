import { useState } from 'react';
import Card from '../components/Card.jsx';
import CardModal from '../components/CardModal.jsx';
import IntroReveal from '../components/IntroReveal.jsx';
import { PROJECTS, SUPPORTERS, CERTS, TYPES, TYPE_SKILLS } from '../data/cards.js';

function EnergyPip({ type }) {
  const t = TYPES[type];
  return <span className="energy-pip" style={{ background: t.color }}>{t.code}</span>;
}

export default function GalleryView({ activeCardId, navigate, motionTiltEnabled = false }) {
  const active = activeCardId ? PROJECTS.find((p) => p.id === activeCardId) : null;
  const [replayKey, setReplayKey] = useState(0);

  return (
    <div className="wrap">
      <div className="hero">
        <div
          onClick={() => setReplayKey((k) => k + 1)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') setReplayKey((k) => k + 1);
          }}
        >
          <IntroReveal replayKey={replayKey} />
        </div>
        <div>
          <div className="eyebrow">Trainer ID · Career Set 2026</div>
          <h1 className="trainer-name">Mahmoud "Fred" Farid</h1>
          <div className="trainer-class">
            Trainer class: <b>Solutions Architect / MLOps</b> — final-year IT student (Data &amp; AI + Cloud Computing) · Leiden, NL
          </div>
          <div className="hero-summary">
            Seven years leading e-commerce before pivoting into cloud, ML and software architecture — sole developer
            of a ~92%-accuracy severe-weather ML platform on AWS, trainer of the best-of-four tulip detector (F1 0.86)
            picked for production, and current builder of Jericho, a hexagonally-architected ambient AI assistant.
          </div>
          <div className="contact-row">
            <a className="pill" href="mailto:mahmoudelkassas9893@gmail.com">✉ mahmoudelkassas9893@gmail.com</a>
            <a className="pill" href="https://github.com/Fredd93" target="_blank" rel="noopener noreferrer">⌥ github.com/Fredd93</a>
            <a className="pill" href="https://linkedin.com/in/fred-farid-dev" target="_blank" rel="noopener noreferrer">in linkedin.com/in/fred-farid-dev</a>
            <span className="pill">📍 Leiden, Netherlands</span>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-title"><span className="num">HOW TO READ THIS</span> Rarity Guide</div>
        <div className="section-sub">Same as a real booster pack — rarity tracks ownership and role, not size. HP is raw project volume, on its own axis; a Common can out-code a flagship.</div>
        <div className="legend">
          <div className="legend-item">● <b>Common</b> — academic build, supporting role</div>
          <div className="legend-item">◆ <b>Holo Rare</b> — shipped solo, or led the room</div>
          <div className="legend-item">★ <b>Reverse Holo</b> — sole dev, heaviest personal commit share</div>
          <div className="legend-item" style={{ color: '#e8c15a' }}>★ <b>IR</b> — flagship #3 — team capstone, client-facing lead</div>
          <div className="legend-item" style={{ color: '#e8c15a' }}>★★ <b>SIR</b> — flagship #2 — solo, professional, end to end</div>
          <div className="legend-item" style={{ color: '#e8c15a' }}>★★★ <b>SSIR</b> — top flagship — solo-architected, ongoing</div>
        </div>
      </div>

      <div className="section">
        <div className="section-title"><span className="num">FULL COLLECTION</span> Projects</div>
        <div className="section-sub">Twelve cards. Click any of them to flip and read the full stats.</div>
        <div className="grid">
          {PROJECTS.map((p, i) => (
            <Card
              key={p.id}
              project={p}
              index={i}
              total={17}
              onClick={(project) => navigate(`#/gallery/${project.id}`)}
              motionTiltEnabled={motionTiltEnabled}
            />
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-title"><span className="num">TRAINER DECK</span> Experience</div>
        <div className="section-sub">Supporter cards — the people-and-process side of the deck.</div>
        <div className="supporter-grid">
          {SUPPORTERS.map((s) => (
            <div className="supporter" key={s.id}>
              <div className="supporter-top"><span>Trainer</span><span>Supporter</span></div>
              <div className="supporter-body">
                <h4>{s.name}</h4>
                <div className="role-meta">{s.sub} · {s.dates}</div>
                <p>{s.text}</p>
                <div className="supporter-rule">{s.rule}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-title"><span className="num">ENERGY</span> Certifications</div>
        <div className="section-sub">What powers the attacks.</div>
        <div className="energy-grid">
          {CERTS.map((c) => (
            <div className="energy-card" key={c.id}>
              <div className="energy-orb" style={{ background: c.color }}>{c.code}</div>
              <h5>{c.name}</h5>
              <span>{c.sub}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-title"><span className="num">TYPE CHART</span> Core Skills</div>
        <div className="section-sub">Every attack above draws on one of these.</div>
        <div className="type-chart">
          {Object.entries(TYPES).map(([k, t]) => (
            <div className="type-chip" key={k}>
              <EnergyPip type={k} />
              <div className="tc-body"><b>{t.name}</b><span>{TYPE_SKILLS[k]}</span></div>
            </div>
          ))}
        </div>
      </div>

      <footer>
        Fred TCG · Career Set · Leiden, NL · 2026 — every stat on this page is backed by a repo, a report grade, or a commit log.
        <div className="foot-links">
          <a href="mailto:mahmoudelkassas9893@gmail.com">Email</a>
          <a href="https://github.com/Fredd93" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://linkedin.com/in/fred-farid-dev" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </footer>

      <CardModal project={active} onClose={() => navigate('#/gallery')} />
    </div>
  );
}
