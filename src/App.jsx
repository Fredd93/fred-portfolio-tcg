// src/App.jsx
import { useEffect, useRef, useState } from 'react';
import { useHashRoute } from './hooks/useHashRoute.js';
import GalleryView from './views/GalleryView.jsx';
import PackOpeningView from './views/PackOpeningView.jsx';
import { publishTilt } from './utils/motionTiltBus.js';

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

export default function App() {
  const { route, navigate } = useHashRoute();
  const [isTouchDevice, setIsTouchDevice] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: none) and (pointer: coarse)').matches
  );
  const [motionTiltEnabled, setMotionTiltEnabled] = useState(false);
  const [motionTiltError, setMotionTiltError] = useState('');
  const receivedOrientationRef = useRef(false);
  const pendingTiltRef = useRef(null);
  const rafIdRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(hover: none) and (pointer: coarse)');
    function onChange() {
      setIsTouchDevice(mql.matches);
    }
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!motionTiltEnabled) return;
    receivedOrientationRef.current = false;
    function onOrientation(e) {
      receivedOrientationRef.current = true;
      const beta = clamp(e.beta ?? 0, -20, 20);
      const gamma = clamp(e.gamma ?? 0, -20, 20);
      const my = ((beta + 20) / 40) * 100;
      const mx = ((gamma + 20) / 40) * 100;
      pendingTiltRef.current = { mx, my };
      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(() => {
          rafIdRef.current = null;
          if (pendingTiltRef.current) {
            publishTilt(pendingTiltRef.current.mx, pendingTiltRef.current.my);
          }
        });
      }
    }
    window.addEventListener('deviceorientation', onOrientation);
    const watchdog = setTimeout(() => {
      if (!receivedOrientationRef.current) {
        setMotionTiltEnabled(false);
        setMotionTiltError('Motion access unavailable — using touch-drag instead.');
      }
    }, 1000);
    return () => {
      window.removeEventListener('deviceorientation', onOrientation);
      clearTimeout(watchdog);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      pendingTiltRef.current = null;
    };
  }, [motionTiltEnabled]);

  async function handleToggleMotionTilt() {
    setMotionTiltError('');
    if (motionTiltEnabled) {
      setMotionTiltEnabled(false);
      return;
    }
    if (typeof window.DeviceOrientationEvent === 'undefined') {
      setMotionTiltError('Motion access unavailable — using touch-drag instead.');
      return;
    }
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const result = await DeviceOrientationEvent.requestPermission();
        if (result === 'granted') {
          setMotionTiltEnabled(true);
        } else {
          setMotionTiltError('Motion access denied — using touch-drag instead.');
        }
      } catch {
        setMotionTiltError('Motion access denied — using touch-drag instead.');
      }
    } else {
      setMotionTiltEnabled(true);
    }
  }

  return (
    <>
      <div className="top-nav">
        <div className="top-nav-inner">
          <div className="brand">Fred<span className="dot">TCG</span></div>
          <div className="tabs">
            <button
              className={`tab-btn ${route.view === 'pack' ? 'active' : ''}`}
              onClick={() => navigate('#/pack')}
            >
              Open Pack
            </button>
            <button
              className={`tab-btn ${route.view === 'gallery' ? 'active' : ''}`}
              onClick={() => navigate('#/gallery')}
            >
              Full Collection
            </button>
          </div>
          {isTouchDevice && (
            <div className="motion-tilt-group">
              <button
                className={`pill motion-tilt-btn ${motionTiltEnabled ? 'active' : ''}`}
                onClick={handleToggleMotionTilt}
                aria-pressed={motionTiltEnabled}
              >
                {motionTiltEnabled ? '✓ Motion tilt on — tap to disable' : 'Enable motion tilt'}
              </button>
              {motionTiltError && (
                <span className="motion-tilt-error" role="status" aria-live="polite">{motionTiltError}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {route.view === 'pack' ? (
        <PackOpeningView pull={route.pull} navigate={navigate} />
      ) : (
        <GalleryView activeCardId={route.card} navigate={navigate} motionTiltEnabled={motionTiltEnabled} />
      )}
    </>
  );
}
