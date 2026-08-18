// src/components/FullArtScenes.jsx
// Bespoke full-art background scenes for the flagship IR/SIR/SSIR projects.
// Falls back to a centered icon on a radial gradient for any full-art
// project that doesn't have a registered scene yet.

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
          <span className="jericho-ring r3" />
          <span className="jericho-ring r2" />
          <span className="jericho-ring r1" />
        </div>
        <span className="jericho-sat">🛰️</span>
      </div>
    </div>
  );
}

const FULLART_SCENES = {
  jericho: JerichoScene,
};

export function FullArtScene({ project }) {
  const Scene = FULLART_SCENES[project.id];
  return Scene ? <Scene /> : <DefaultFullArtScene icon={project.icon} />;
}

export { FULLART_SCENES, DefaultFullArtScene };
