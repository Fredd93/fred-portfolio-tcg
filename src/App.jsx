// src/App.jsx
import { useEffect, useState } from 'react';
import { useHashRoute } from './hooks/useHashRoute.js';
import GalleryView from './views/GalleryView.jsx';
import PackOpeningView from './views/PackOpeningView.jsx';
import { publishTilt } from './utils/motionTiltBus.js';

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

export default function App() {
  const { route, navigate } = useHashRoute();
  const [isTouchDevice] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: none) and (pointer: coarse)').matches
  );
  const [motionTiltEnabled, setMotionTiltEnabled] = useState(false);
  const [motionTiltError, setMotionTiltError] = useState('');

  useEffect(() => {
    if (!motionTiltEnabled) return;
    function onOrientation(e) {
      const beta = clamp(e.beta ?? 0, -20, 20);
      const gamma = clamp(e.gamma ?? 0, -20, 20);
      const my = ((beta + 20) / 40) * 100;
      const mx = ((gamma + 20) / 40) * 100;
      publishTilt(mx, my);
    }
    window.addEventListener('deviceorientation', onOrientation);
    return () => window.removeEventListener('deviceorientation', onOrientation);
  }, [motionTiltEnabled]);

  async function handleEnableMotionTilt() {
    setMotionTiltError('');
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
            <>
              <button
                className={`motion-tilt-btn ${motionTiltEnabled ? 'active' : ''}`}
                onClick={handleEnableMotionTilt}
                disabled={motionTiltEnabled}
              >
                {motionTiltEnabled ? '✓ Motion tilt on' : 'Enable motion tilt'}
              </button>
              {motionTiltError && <span className="motion-tilt-error">{motionTiltError}</span>}
            </>
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
