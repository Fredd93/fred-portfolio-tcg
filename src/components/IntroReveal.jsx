// src/components/IntroReveal.jsx
// "Who's That Dev?" reveal — the anime "Who's That Pokemon?" intermission,
// re-skinned. Plays once per session (sessionStorage-gated by the parent
// via `autoplay`), and replays whenever `replayKey` changes.
import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import fredCutout from '../assets/fred-photo-cutout.png';

const SESSION_KEY = 'fredtcg_intro_seen';

function safeGetSeen() {
  try {
    return !!sessionStorage.getItem(SESSION_KEY);
  } catch {
    return false;
  }
}

function safeMarkSeen() {
  try {
    sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    // ignore — sandboxed/restrictive environments may block storage access
  }
}

export default function IntroReveal({ replayKey = 0, onReplayRequest }) {
  const [phase, setPhase] = useState('silhouette'); // 'silhouette' | 'revealed'
  const [playing, setPlaying] = useState(() => !safeGetSeen());
  const reduce = useReducedMotion();

  useEffect(() => {
    if (replayKey === 0) return;
    setPhase('silhouette');
    setPlaying(true);
  }, [replayKey]);

  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => {
      setPhase('revealed');
      safeMarkSeen();
    }, 1300);
    return () => clearTimeout(timer);
  }, [playing, replayKey]);

  function skip() {
    setPhase('revealed');
    safeMarkSeen();
    setPlaying(false);
  }

  const resolved = !playing || phase === 'revealed';
  const isSkippable = playing && phase === 'silhouette';

  // Single unified activation handler: skip the silhouette while it's
  // playing, otherwise (already resolved) request a replay from the
  // parent. This is the only interactive element in this subtree — the
  // parent (GalleryView) no longer wraps it in its own role="button".
  function activate() {
    if (isSkippable) {
      skip();
    } else {
      onReplayRequest?.();
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      if (e.key === ' ') e.preventDefault();
      activate();
    }
  }

  return (
    <div
      className="intro-reveal"
      onClick={activate}
      role="button"
      tabIndex={0}
      aria-label={resolved ? "It's Fred! Click to replay" : "Who's that Dev? Click to reveal"}
      onKeyDown={handleKeyDown}
    >
      <motion.div
        className="intro-reveal-flip"
        animate={{ rotateY: resolved ? 180 : 0 }}
        transition={{ duration: reduce ? 0 : 0.6, ease: 'easeInOut' }}
      >
        <div className="intro-reveal-face intro-reveal-face-front">
          <div className="intro-reveal-burst" />
          <img
            className="intro-reveal-cutout intro-reveal-silhouette"
            src={fredCutout}
            alt=""
            aria-hidden="true"
          />
          <div className="intro-reveal-qmark" aria-hidden="true">?</div>
        </div>
        <div className="intro-reveal-face intro-reveal-face-back">
          <div className="intro-reveal-burst" />
          <img
            className="intro-reveal-cutout"
            src={fredCutout}
            alt=""
            aria-hidden="true"
          />
        </div>
      </motion.div>
      <div className="intro-reveal-caption">
        {resolved ? 'It\'s Fred!' : "Who's that Dev?"}
      </div>
    </div>
  );
}
