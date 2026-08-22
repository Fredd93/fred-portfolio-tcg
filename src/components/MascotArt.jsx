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

export function TulipMascot({ className = '' }) {
  return (
    <svg
      className={`mascot mascot-tulip ${className}`}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="TulipVision bloom-scanner mascot"
    >
      <path className="tulip-m-stem" d="M50 95 L50 60" />
      <path className="tulip-m-leaf tulip-m-leaf-l" d="M50 82 Q30 78 26 62 Q42 66 50 82Z" />
      <path className="tulip-m-leaf tulip-m-leaf-r" d="M50 82 Q70 78 74 62 Q58 66 50 82Z" />
      <g className="tulip-m-bloom">
        <path className="tulip-m-petal tulip-m-petal-l" d="M50 60 Q20 55 26 28 Q42 34 50 60Z" />
        <path className="tulip-m-petal tulip-m-petal-r" d="M50 60 Q80 55 74 28 Q58 34 50 60Z" />
        <path className="tulip-m-petal tulip-m-petal-c" d="M46 60 Q46 20 50 14 Q54 20 54 60Z" />
        <circle className="tulip-m-lens-outer" cx="50" cy="42" r="11" />
        <circle className="tulip-m-lens-iris" cx="50" cy="42" r="6" />
        <circle className="tulip-m-lens-pupil" cx="50" cy="42" r="2.4" />
      </g>
    </svg>
  );
}

export function ImpalaMascot({ className = '' }) {
  return (
    <svg
      className={`mascot mascot-impala ${className}`}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Severe Weather heat/cold sentinel mascot"
    >
      <clipPath id="impala-m-split-left"><rect x="0" y="0" width="50" height="100" /></clipPath>
      <clipPath id="impala-m-split-right"><rect x="50" y="0" width="50" height="100" /></clipPath>
      <g className="impala-m-heat" clipPath="url(#impala-m-split-left)">
        <path className="impala-m-tail impala-m-tail-heat" d="M26 66 Q6 60 10 40 Q22 46 26 66Z" />
        <ellipse className="impala-m-torso impala-m-torso-heat" cx="50" cy="60" rx="26" ry="20" />
        <circle className="impala-m-head impala-m-head-heat" cx="50" cy="34" r="16" />
        <polygon className="impala-m-ear impala-m-ear-heat" points="38,24 30,6 46,18" />
      </g>
      <g className="impala-m-cold" clipPath="url(#impala-m-split-right)">
        <path className="impala-m-tail impala-m-tail-cold" d="M74 66 Q94 60 90 40 Q78 46 74 66Z" />
        <ellipse className="impala-m-torso impala-m-torso-cold" cx="50" cy="60" rx="26" ry="20" />
        <circle className="impala-m-head impala-m-head-cold" cx="50" cy="34" r="16" />
        <polygon className="impala-m-ear impala-m-ear-cold" points="62,24 70,6 54,18" />
      </g>
      <circle className="impala-m-eye" cx="44" cy="34" r="2" />
      <circle className="impala-m-eye" cx="56" cy="34" r="2" />
    </svg>
  );
}

export const MASCOTS = {
  jericho: JerichoMascot,
  tulip: TulipMascot,
  impala: ImpalaMascot,
};

export function MascotArt({ id, className }) {
  const Mascot = MASCOTS[id];
  return Mascot ? <Mascot className={className} /> : null;
}

export default MascotArt;
