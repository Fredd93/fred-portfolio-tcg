// src/components/FullArtScenes.jsx
// Bespoke full-art background scenes for the flagship IR/SIR/SSIR projects.
// Falls back to a centered icon on a radial gradient for any full-art
// project that doesn't have a registered scene yet.

import { Fragment } from 'react';
import { JerichoMascot, TulipMascot } from './MascotArt.jsx';

function DefaultFullArtScene({ icon }) {
  return (
    <div className="art-bg">
      <span>{icon}</span>
    </div>
  );
}

function JerichoScene() {
  return (
    <div className="art-bg scene-jericho">
      <div className="jericho-stars" />
      <div className="jericho-horizon" />
      <div className="jericho-hex" />
      <div className="jericho-signal" />
      <div className="jericho-house-glow" />
      <span className="jericho-house">🏠</span>
      <div className="jericho-sat-wrap">
        <div className="jericho-rings">
          <span className="jericho-ring jericho-ring-3" />
          <span className="jericho-ring jericho-ring-2" />
          <span className="jericho-ring jericho-ring-1" />
        </div>
        <JerichoMascot className="jericho-sat" />
      </div>
    </div>
  );
}

const TULIP_BACKGROUND = [
  { left: '6%', bottom: '26%', size: 14, opacity: .6 },
  { left: '12%', bottom: '47%', size: 18, opacity: .75 },
  { left: '24%', bottom: '22%', size: 13, opacity: .55 },
  { left: '40%', bottom: '24%', size: 15, opacity: .6 },
  { left: '45%', bottom: '50%', size: 17, opacity: .7 },
  { left: '70%', bottom: '23%', size: 14, opacity: .55 },
  { left: '82%', bottom: '46%', size: 18, opacity: .75 },
  { left: '90%', bottom: '25%', size: 13, opacity: .55 },
  { left: '37%', bottom: '20%', size: 12, opacity: .5 },
  { left: '56%', bottom: '21%', size: 13, opacity: .5 },
];

const TULIP_FOREGROUND = [
  { left: '20%', bottom: '42%', size: 21 },
  { left: '34%', bottom: '38%', size: 25 },
  { left: '50%', bottom: '44%', size: 18 },
  { left: '63%', bottom: '36%', size: 28 },
  { left: '74%', bottom: '41%', size: 20 },
];

const TULIP_DETECTIONS = [
  { left: '29%', bottom: '35%', width: 39, height: 44, tier: 'high', pct: 94 },
  { left: '58%', bottom: '33%', width: 44, height: 48, tier: 'mid', pct: 78 },
  { left: '15%', bottom: '39%', width: 30, height: 32, tier: 'low', pct: 52 },
];

function TulipVisionScene() {
  return (
    <div className="art-bg scene-tulip">
      <div className="tulip-rows" />
      <div className="tulip-glow" />
      {TULIP_BACKGROUND.map((t, i) => (
        <span
          key={`bg-${i}`}
          className="tulip-glyph"
          style={{ left: t.left, bottom: t.bottom, fontSize: t.size, opacity: t.opacity }}
        >🌷</span>
      ))}
      {TULIP_FOREGROUND.map((t, i) => (
        <div
          key={`fg-${i}`}
          className="tulip-mascot-slot"
          style={{ left: t.left, bottom: t.bottom, width: t.size * 1.6, height: t.size * 1.6 }}
        >
          <TulipMascot />
        </div>
      ))}
      {TULIP_DETECTIONS.map((d) => (
        <Fragment key={d.tier}>
          <div
            className={`tulip-box tulip-box-${d.tier}`}
            style={{ left: d.left, bottom: d.bottom, width: d.width, height: d.height }}
          />
          <div
            className={`tulip-conf tulip-conf-${d.tier}`}
            style={{ left: d.left, bottom: `calc(${d.bottom} + ${d.height + 1}px)` }}
          >R-CNN {d.pct}%</div>
        </Fragment>
      ))}
    </div>
  );
}

function SevereWeatherScene() {
  return (
    <div className="art-bg scene-impala">
      <div className="impala-sun" />
      <svg className="impala-wind" viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 10 Q 30 4, 55 10 T 95 8" />
        <path d="M2 22 Q 25 16, 48 22 T 85 20" />
        <path d="M2 33 Q 20 29, 38 33 T 70 31" />
      </svg>
      <svg className="impala-shimmer" viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 18 Q 8 13, 16 18 T 32 18" />
        <path d="M0 32 Q 8 27, 16 32 T 32 32" />
        <path d="M0 46 Q 8 41, 16 46 T 32 46" />
      </svg>
      <span className="impala-snowflake">❄️</span>
      <span className="impala-crystal impala-crystal-a">❆</span>
      <span className="impala-crystal impala-crystal-b">❆</span>
      <div className="impala-icing" />
      <div className="impala-icing2" />
    </div>
  );
}

const FULLART_SCENES = {
  jericho: JerichoScene,
  tulip: TulipVisionScene,
  impala: SevereWeatherScene,
};

export function FullArtScene({ project }) {
  const Scene = FULLART_SCENES[project.id];
  return Scene ? <Scene /> : <DefaultFullArtScene icon={project.icon} />;
}

export { FULLART_SCENES, DefaultFullArtScene };
