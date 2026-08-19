// src/utils/motionTiltBus.js
// Lightweight pub/sub so a single window-level deviceorientation listener
// (owned by App.jsx) can drive every mounted Card's tilt transform without
// each card registering its own orientation listener.

const listeners = new Set();

export function subscribeTilt(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function publishTilt(mx, my) {
  listeners.forEach((fn) => fn(mx, my));
}
