// src/components/MascotArt.jsx
// Bespoke SVG mascots for the flagship IR/SIR/SSIR projects, replacing the
// flat project emoji. Mirrors the FULLART_SCENES registry pattern in
// FullArtScenes.jsx. Each mascot is a self-contained <svg> using class
// hooks (no inline style) so mascot.css can drive idle/hover animation.

export function JerichoMascot({ className = '' }) {
  return (
    <svg
      className={`mascot mascot-jericho ${className}`}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Jericho sentinel mascot"
    >
      <polygon className="jericho-m-body" points="50,30 68,40 68,62 50,72 32,62 32,40" />
      <circle className="jericho-m-head" cx="50" cy="24" r="14" />
      <polygon className="jericho-m-ear jericho-m-ear-l" points="38,16 30,2 44,12" />
      <polygon className="jericho-m-ear jericho-m-ear-r" points="62,16 70,2 56,12" />
      <circle className="jericho-m-tip jericho-m-tip-l" cx="31" cy="4" r="2.4" />
      <circle className="jericho-m-tip jericho-m-tip-r" cx="69" cy="4" r="2.4" />
      <circle className="jericho-m-eye jericho-m-eye-l" cx="45" cy="24" r="2" />
      <circle className="jericho-m-eye jericho-m-eye-r" cx="55" cy="24" r="2" />
      <line className="jericho-m-seam" x1="50" y1="30" x2="50" y2="72" />
      <line className="jericho-m-seam" x1="32" y1="40" x2="68" y2="40" />
      <line className="jericho-m-seam" x1="32" y1="62" x2="68" y2="62" />
    </svg>
  );
}

export const MASCOTS = {
  jericho: JerichoMascot,
};

export function MascotArt({ id, className }) {
  const Mascot = MASCOTS[id];
  return Mascot ? <Mascot className={className} /> : null;
}

export default MascotArt;
