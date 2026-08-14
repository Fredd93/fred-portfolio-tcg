import { useCallback, useEffect, useState } from 'react';
import { PACK_ORDER, PROJECTS } from '../data/cards.js';

function parseHash(hash) {
  const clean = hash.replace(/^#\/?/, ''); // strip leading '#' and '/'
  const parts = clean.split('/').filter(Boolean);

  if (parts[0] === 'gallery') {
    const cardId = parts[1];
    const valid = cardId && PROJECTS.some((p) => p.id === cardId);
    return { view: 'gallery', card: valid ? cardId : null };
  }

  // Default view is 'pack' for '', '#', '#/', '#/pack', '#/pack/...'
  const raw = parts[1]; // undefined | 'done' | a number-like string
  if (raw === 'done') {
    return { view: 'pack', pull: 'done' };
  }
  if (raw !== undefined) {
    const n = Number(raw);
    if (Number.isInteger(n) && n >= 0 && n < PACK_ORDER.length) {
      return { view: 'pack', pull: n };
    }
  }
  return { view: 'pack', pull: null };
}

export function useHashRoute() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));

  useEffect(() => {
    function onHashChange() {
      setRoute(parseHash(window.location.hash));
    }
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((hash) => {
    window.location.hash = hash;
  }, []);

  return { route, navigate };
}
