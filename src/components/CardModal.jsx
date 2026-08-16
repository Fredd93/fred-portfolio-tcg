// src/components/CardModal.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { RARITY, TYPES } from '../data/cards.js';

function EnergyPip({ type }) {
  const t = TYPES[type];
  return <span className="energy-pip" style={{ background: t.color }}>{t.code}</span>;
}

export default function CardModal({ project, onClose }) {
  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="modal-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className="modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
          >
            <button className="modal-close" onClick={onClose}>✕</button>
            <div style={{ fontSize: 40, marginBottom: 6 }}>{project.icon}</div>
            <h3>{project.name}</h3>
            <div className="modal-meta">
              {project.context} · {project.dates} · {RARITY[project.rarity].sym} {RARITY[project.rarity].label} · HP {project.hp} ({project.hpMetric === 'loc' ? 'LOC' : 'est.'})
            </div>
            {project.attacks.map((a) => (
              <div className="attack" key={a.name}>
                <div className="atk-cost">{a.cost.map((c) => <EnergyPip key={c} type={c} />)}</div>
                <div style={{ flex: 1 }}>
                  <div className="atk-head">
                    <span>{a.name}</span>
                    {a.dmg ? <span className="atk-dmg">{a.dmg}</span> : null}
                  </div>
                  <div className="atk-text" style={{ fontSize: 12.5 }}>{a.text}</div>
                </div>
              </div>
            ))}
            <p style={{ marginTop: 14 }}>
              <b>Role:</b> {project.role} &nbsp; <b>Resistance:</b> {project.resistance} &nbsp; <b>Retreat:</b> {project.retreat}
            </p>
            <p><b>Languages:</b> {project.languages.join(', ')}</p>
            <p style={{ fontStyle: 'italic', color: '#b7bdd0' }}>{project.flavor}</p>
            {project.detail && <p>{project.detail}</p>}
            {project.link ? (
              <a className="modal-link" href={`https://${project.link}`} target="_blank" rel="noopener noreferrer">
                {project.linkLabel || 'View repo'} →
              </a>
            ) : project.linkLabel ? (
              <div className="modal-link" style={{ color: 'var(--muted)' }}>{project.linkLabel}</div>
            ) : null}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
