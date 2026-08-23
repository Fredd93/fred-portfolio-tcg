// src/hooks/useInViewAnimation.js
// Tracks whether an element is within (or near) the viewport, so callers
// can pause CSS animations on off-screen cards for mobile/scroll performance.
import { useEffect, useRef, useState } from 'react';

export function useInViewAnimation() {
  const ref = useRef(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '200px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}
