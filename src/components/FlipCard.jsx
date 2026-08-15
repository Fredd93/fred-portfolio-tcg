// src/components/FlipCard.jsx
import { motion } from 'framer-motion';
import PackCard from './PackCard.jsx';
import { TYPES } from '../data/cards.js';

function CardBack() {
  return (
    <div className="card-back">
      <div className="mark">F</div>
    </div>
  );
}

export default function FlipCard({ item, index, total, flipped, onReveal, onInspect }) {
  const isProject = item.kind === 'project';
  const typeColor = isProject ? TYPES[item.data.type].color : '#e8c15a';

  function handleClick() {
    if (!flipped) {
      onReveal?.();
    } else if (isProject) {
      onInspect?.();
    }
  }

  return (
    <div className="tcg-card-wrap" onClick={handleClick}>
      <div className="flip-outer">
        <motion.div
          className="flip-inner"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flip-face flip-front">
            <CardBack />
          </div>
          <div
            className={`flip-face flip-back ${isProject ? `tcg-card rarity-${item.data.rarity}` : ''}`}
            style={isProject ? { '--type-color': typeColor, cursor: flipped ? 'pointer' : 'default' } : undefined}
          >
            <PackCard item={item} index={index} total={total} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
