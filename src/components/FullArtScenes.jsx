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

const FULLART_SCENES = {};

export function FullArtScene({ project }) {
  const Scene = FULLART_SCENES[project.id];
  return Scene ? <Scene /> : <DefaultFullArtScene icon={project.icon} />;
}

export { FULLART_SCENES, DefaultFullArtScene };
