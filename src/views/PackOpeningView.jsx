// src/views/PackOpeningView.jsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FlipCard from '../components/FlipCard.jsx';
import { PACK_ORDER, RARITY } from '../data/cards.js';

export default function PackOpeningView({ pull, navigate }) {
  const [tearing, setTearing] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const total = PACK_ORDER.length;
  const cursor = typeof pull === 'number' ? pull : 0;
  const current = PACK_ORDER[cursor];
  const isLast = cursor === total - 1;

  const stage = tearing
    ? 'opening'
    : pull === 'done'
      ? 'done'
      : pull === null
        ? 'closed'
        : 'revealing';

  useEffect(() => {
    setFlipped(false);
  }, [pull]);

  function openPack() {
    setTearing(true);
    setTimeout(() => {
      setTearing(false);
      navigate('#/pack/0');
    }, 750);
  }

  function reveal() {
    setFlipped(true);
  }

  function next() {
    if (isLast) {
      navigate('#/pack/done');
    } else {
      navigate(`#/pack/${cursor + 1}`);
    }
  }

  function resetPack() {
    navigate('#/pack');
  }

  return (
    <div className="wrap pack-wrap">
      <div className="section" style={{ marginTop: 24 }}>
        <div className="section-title"><span className="num">ELITE TRAINER BOX</span> Open the Career Pack</div>
        <div className="section-sub">
          {stage === 'closed' && `One pack, ${total} pulls, one flagship chase card. Tap it.`}
          {stage === 'opening' && 'Tearing it open…'}
          {stage === 'revealing' && `Pull ${cursor + 1} of ${total} — tap the card to flip it.`}
          {stage === 'done' && `That's the whole box. Here's everything that was pulled.`}
        </div>
      </div>

      <div className="pack-stage">
        <AnimatePresence mode="wait">
          {stage === 'closed' && (
            <motion.div
              key="pack"
              className="etb-pack"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.97 }}
              onClick={openPack}
            >
              <div className="etb-shine" />
              <div className="etb-label">FRED TCG</div>
              <div className="etb-title">Career Booster Pack</div>
              <div className="etb-sub">{total} cards · 1 guaranteed flagship</div>
              <div className="etb-cta">Tap to open</div>
            </motion.div>
          )}

          {stage === 'opening' && (
            <motion.div
              key="opening"
              className="etb-pack opening"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.08, 0.4], rotate: [0, -4, 12], opacity: [1, 1, 0] }}
              transition={{ duration: 0.7, times: [0, 0.4, 1] }}
            >
              <div className="etb-label">FRED TCG</div>
              <div className="etb-title">Career Booster Pack</div>
            </motion.div>
          )}

          {stage === 'revealing' && current && (
            <motion.div
              key={`card-${cursor}`}
              className="reveal-stage"
              initial={{ opacity: 0, y: 24, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <FlipCard item={current} index={cursor} total={total} flipped={flipped} onReveal={reveal} />
              <div className="reveal-controls">
                {!flipped ? (
                  <button className="pack-btn" onClick={reveal}>Flip card</button>
                ) : (
                  <button className="pack-btn primary" onClick={next}>
                    {isLast ? 'See the whole pull →' : 'Next card →'}
                  </button>
                )}
              </div>
              <div className="pull-progress">
                {PACK_ORDER.map((_, i) => (
                  <span key={i} className={`dot ${i < cursor ? 'done' : ''} ${i === cursor ? 'active' : ''}`} />
                ))}
              </div>
            </motion.div>
          )}

          {stage === 'done' && (
            <motion.div key="done" className="pull-summary" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="pull-grid">
                {PACK_ORDER.map((item, i) => (
                  <div key={i} className={`pull-thumb rarity-${item.kind === 'project' ? item.data.rarity : 'holo'}`}>
                    <span>{item.kind === 'project' ? item.data.icon : item.kind === 'supporter' ? '🤝' : '⚡'}</span>
                    <b>{item.data.name}</b>
                    <small>{item.kind === 'project' ? RARITY[item.data.rarity].label : item.kind === 'supporter' ? 'Supporter' : 'Energy'}</small>
                  </div>
                ))}
              </div>
              <div className="pull-actions">
                <button className="pack-btn" onClick={resetPack}>Open another pack</button>
                <button className="pack-btn primary" onClick={() => navigate('#/gallery')}>Browse the full collection →</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
