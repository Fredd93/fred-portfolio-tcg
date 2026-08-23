// src/components/IntroReveal.jsx
// "Who's That Dev?" reveal — the anime "Who's That Pokemon?" intermission,
// re-skinned. Plays once per session (sessionStorage-gated by the parent
// via `autoplay`), and replays whenever `replayKey` changes.
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import fredPhoto from '../assets/fred-photo-placeholder.svg';

const SESSION_KEY = 'fredtcg_intro_seen';

export default function IntroReveal({ replayKey = 0 }) {
  const [phase, setPhase] = useState('silhouette'); // 'silhouette' | 'revealed'
  const [playing, setPlaying] = useState(() => !sessionStorage.getItem(SESSION_KEY));

  useEffect(() => {
    if (replayKey === 0) return;
    setPhase('silhouette');
    setPlaying(true);
  }, [replayKey]);

  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => {
      setPhase('revealed');
      sessionStorage.setItem(SESSION_KEY, '1');
    }, 1300);
    return () => clearTimeout(timer);
  }, [playing, replayKey]);

  function skip(e) {
    // Stop propagation so a parent's click-to-replay handler (see
    // GalleryView) doesn't immediately undo this skip by restarting
    // the silhouette phase.
    e?.stopPropagation();
    setPhase('revealed');
    sessionStorage.setItem(SESSION_KEY, '1');
    setPlaying(false);
  }

  const resolved = !playing || phase === 'revealed';

  return (
    <div
      className="intro-reveal"
      onClick={playing && phase === 'silhouette' ? skip : undefined}
      role={playing && phase === 'silhouette' ? 'button' : undefined}
      tabIndex={playing && phase === 'silhouette' ? 0 : undefined}
      onKeyDown={playing && phase === 'silhouette' ? (e) => e.key === 'Enter' && skip() : undefined}
    >
      <AnimatePresence mode="wait">
        {!resolved ? (
          <motion.div
            key="silhouette"
            className="intro-reveal-photo intro-reveal-silhouette"
            style={{ backgroundImage: `url(${fredPhoto})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        ) : (
          <motion.div
            key="revealed"
            className="intro-reveal-photo intro-reveal-color"
            style={{ backgroundImage: `url(${fredPhoto})` }}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
          />
        )}
      </AnimatePresence>
      <div className="intro-reveal-caption">
        {resolved ? 'It\'s Fred!' : "Who's that Dev?"}
      </div>
    </div>
  );
}
