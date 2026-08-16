import { useRef } from 'react';
import { motion } from 'framer-motion';
import { TYPES, RARITY } from '../data/cards.js';

const FULLART = new Set(['ir', 'sir', 'ssir']);

export function EnergyPip({ type }) {
  const t = TYPES[type];
  return (
    <span className="energy-pip" style={{ background: t.color }} title={t.name}>
      {t.code}
    </span>
  );
}

// Pure front-face markup, reused by the gallery card and the pack-opening flip card.
export function CardFace({ project, index = 0, total = 17 }) {
  const r = RARITY[project.rarity];
  const type = TYPES[project.type];
  const fullArt = FULLART.has(project.rarity);
  const languages = project.languages ?? [];

  return (
    <div className={`tcg-face ${fullArt ? 'layout-fullart' : 'layout-classic'}`} style={{ '--type-color': type.color }}>
      {fullArt && <div className="art-bg"><span>{project.icon}</span></div>}
      <div className="top-row">
        <div>
          <div className="stage-pill">{project.stage}</div>
          <div className="name">{project.name}</div>
        </div>
        <div className="hp">
          HP {project.hp}<small>{project.hpMetric === 'loc' ? 'LOC' : 'est.'}</small>
          <EnergyPip type={project.type} />
        </div>
      </div>

      {!fullArt && (
        <>
          <div className="art"><span>{project.icon}</span></div>
          <div className="dex-line">{project.context} · {project.dates}</div>
        </>
      )}

      {!fullArt && (
        <div className="attacks">
          {project.attacks.map((a) => (
            <div className="attack" key={a.name}>
              <div className="atk-cost">{a.cost.map((c) => <EnergyPip key={c} type={c} />)}</div>
              <div style={{ flex: 1 }}>
                <div className="atk-head">
                  <span>{a.name}</span>
                  {a.dmg ? <span className="atk-dmg">{a.dmg}</span> : null}
                </div>
                <div className="atk-text">{a.text}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bottom">
        {fullArt && (
          <div className="attacks">
            {project.attacks.map((a) => (
              <div className="attack" key={a.name}>
                <div className="atk-cost">{a.cost.map((c) => <EnergyPip key={c} type={c} />)}</div>
                <div style={{ flex: 1 }}>
                  <div className="atk-head">
                    <span>{a.name}</span>
                    {a.dmg ? <span className="atk-dmg">{a.dmg}</span> : null}
                  </div>
                  <div className="atk-text">{a.text}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        {fullArt && project.description && (
          <div className="card-description">{project.description}</div>
        )}
        {fullArt && languages.length > 0 && (
          <div className="card-languages">
            {languages.map((lang) => (
              <span className="lang-pip" key={lang}>{lang}</span>
            ))}
          </div>
        )}
        <div className="wrr">
          <span>Role: {project.role}</span>
          <span>Retreat: {project.retreat}</span>
        </div>
        <div className="flavor">{project.flavor}</div>
        <div className="foot">
          <span>FRED TCG · {String(index + 1).padStart(3, '0')}/{String(total).padStart(3, '0')}</span>
          <span style={{ color: fullArt ? 'var(--gold)' : undefined }}>{r.sym} {r.label}</span>
        </div>
      </div>

      <div className="holo-shine" />
    </div>
  );
}

export default function Card({ project, index, total, onClick, tiltEnabled = true }) {
  const ref = useRef(null);
  const type = TYPES[project.type];

  function handleMove(e) {
    if (!tiltEnabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top) / rect.height) * 100;
    ref.current.style.setProperty('--mx', `${mx.toFixed(1)}%`);
    ref.current.style.setProperty('--my', `${my.toFixed(1)}%`);
    const rx = ((my - 50) / 50) * -8;
    const ry = ((mx - 50) / 50) * 8;
    ref.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  }
  function handleLeave() {
    if (ref.current) ref.current.style.transform = 'rotateX(0deg) rotateY(0deg)';
  }

  return (
    <motion.div
      className="tcg-card-wrap"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.5) }}
    >
      <div
        ref={ref}
        className={`tcg-card rarity-${project.rarity}`}
        style={{ '--type-color': type.color }}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        onClick={() => onClick?.(project)}
      >
        <CardFace project={project} index={index} total={total} />
      </div>
    </motion.div>
  );
}
