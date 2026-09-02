// src/components/MascotArt.jsx
// Bespoke SVG mascots for the flagship IR/SIR/SSIR projects (single-svg
// idle-loop) and the 9 non-flagship projects (3-frame lenticular tilt-swap),
// replacing the flat project emoji. Mirrors the FULLART_SCENES registry
// pattern in FullArtScenes.jsx. Each mascot uses class hooks (no inline
// style) so mascot.css can drive idle/hover/frame-swap animation.

// "Node" — a glass-orb core with three hex-plated satellite modules, in the
// Magneton/Electrode lineage (three linked units is Magneton's real canon;
// hex-faceting on the modules is the deliberate departure that reads as
// "ports around a core," matching Jericho's hexagonal-architecture concept).
// The core is a true sphere in silhouette (circular clip) with faceted
// internal chords (Cryogonal-style hard angular facets) and a soft inner
// light visible through the glass (Solosis/Reuniclus cue) — no literal
// shape-morphing. Dormant vs. activated is entirely a lighting change,
// driven by the card's existing .tcg-card:hover / .tilting state.
export function JerichoMascot({ className = '' }) {
  return (
    <svg
      className={`mascot mascot-jericho ${className}`}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Node, Jericho's satellite-core sentinel"
    >
      <defs>
        <clipPath id="jericho-m-core-clip">
          <circle cx="50" cy="54" r="16" />
        </clipPath>
      </defs>

      {/* arcs jump between modules on activation, module hex-seams light in sequence as each arc lands */}
      <path className="jericho-m-arc jericho-m-arc-1" d="M50,20 Q35,40 20.6,71" />
      <path className="jericho-m-arc jericho-m-arc-2" d="M20.6,71 Q50,90 79.4,71" />

      <g className="jericho-m-orbit">
        <g className="jericho-m-sat jericho-m-sat-a" transform="translate(50,20)">
          <polygon className="jericho-m-plate" points="0,-9 7.8,-4.5 7.8,4.5 0,9 -7.8,4.5 -7.8,-4.5" />
          <circle className="jericho-m-rivet" cx="0" cy="0" r="1.6" />
          <rect className="jericho-m-stub" x="-1" y="-15" width="2" height="5" rx="0.6" />
          <polygon className="jericho-m-seam-glow" points="0,-9 7.8,-4.5 7.8,4.5 0,9 -7.8,4.5 -7.8,-4.5" />
        </g>
        <g className="jericho-m-sat jericho-m-sat-b" transform="translate(20.6,71)">
          <polygon className="jericho-m-plate" points="0,-9 7.8,-4.5 7.8,4.5 0,9 -7.8,4.5 -7.8,-4.5" />
          <circle className="jericho-m-rivet" cx="0" cy="0" r="1.6" />
          <rect className="jericho-m-stub" x="-10.5" y="-1" width="5" height="2" rx="0.6" />
          <polygon className="jericho-m-seam-glow" points="0,-9 7.8,-4.5 7.8,4.5 0,9 -7.8,4.5 -7.8,-4.5" />
        </g>
        <g className="jericho-m-sat jericho-m-sat-c" transform="translate(79.4,71)">
          <polygon className="jericho-m-plate" points="0,-9 7.8,-4.5 7.8,4.5 0,9 -7.8,4.5 -7.8,-4.5" />
          <circle className="jericho-m-rivet" cx="0" cy="0" r="1.6" />
          <rect className="jericho-m-stub" x="5.5" y="-1" width="5" height="2" rx="0.6" />
          <polygon className="jericho-m-seam-glow" points="0,-9 7.8,-4.5 7.8,4.5 0,9 -7.8,4.5 -7.8,-4.5" />
        </g>
      </g>

      <circle className="jericho-m-core-rim" cx="50" cy="54" r="16" />
      <g clipPath="url(#jericho-m-core-clip)">
        <circle className="jericho-m-core-glass" cx="50" cy="54" r="16" />
        <circle className="jericho-m-core-light" cx="50" cy="50" r="10" />
        <polygon className="jericho-m-facet jericho-m-facet-a" points="50,54 50,38 63.86,46" />
        <polygon className="jericho-m-facet jericho-m-facet-b" points="50,54 63.86,46 63.86,62" />
        <polygon className="jericho-m-facet jericho-m-facet-c" points="50,54 63.86,62 50,70" />
        <polygon className="jericho-m-facet jericho-m-facet-d" points="50,54 50,70 36.14,62" />
        <polygon className="jericho-m-facet jericho-m-facet-e" points="50,54 36.14,62 36.14,46" />
        <polygon className="jericho-m-facet jericho-m-facet-f" points="50,54 36.14,46 50,38" />
      </g>
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

export function GtaMascot({ className = '' }) {
  return (
    <div className={`mascot-frames ${className}`} role="img" aria-label="Grand Transmission Auto mascot">
      <svg className="mascot-frame mascot-frame-0" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <polygon className="gta-m-body" points="20,55 20,80 80,80 80,55 65,40 35,40" />
        <rect className="gta-m-block" x="30" y="30" width="40" height="18" rx="3" />
        <circle className="gta-m-bolt" cx="30" cy="65" r="2.5" />
        <circle className="gta-m-bolt" cx="70" cy="65" r="2.5" />
        <circle className="gta-m-bolt" cx="50" cy="72" r="2.5" />
        <path className="gta-m-whisker" d="M20 70 Q6 66 8 54" />
        <path className="gta-m-whisker" d="M80 70 Q94 66 92 54" />
        <circle className="gta-m-light" cx="38" cy="58" r="5" />
        <circle className="gta-m-light" cx="62" cy="58" r="5" />
      </svg>
      <svg className="mascot-frame mascot-frame-1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <polygon className="gta-m-body" points="20,55 20,80 80,80 80,55 65,40 35,40" />
        <rect className="gta-m-block" x="30" y="30" width="40" height="18" rx="3" />
        <circle className="gta-m-bolt" cx="30" cy="65" r="2.5" />
        <circle className="gta-m-bolt" cx="70" cy="65" r="2.5" />
        <circle className="gta-m-bolt" cx="50" cy="72" r="2.5" />
        <path className="gta-m-whisker" d="M20 70 Q6 66 8 54" />
        <path className="gta-m-whisker" d="M80 70 Q94 66 92 54" />
        <circle className="gta-m-light gta-m-light-on" cx="38" cy="58" r="5" />
        <circle className="gta-m-light" cx="62" cy="58" r="5" />
      </svg>
      <svg className="mascot-frame mascot-frame-2" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <polygon className="gta-m-body" points="20,55 20,80 80,80 80,55 65,40 35,40" />
        <rect className="gta-m-block" x="30" y="30" width="40" height="18" rx="3" />
        <circle className="gta-m-bolt" cx="30" cy="65" r="2.5" />
        <circle className="gta-m-bolt" cx="70" cy="65" r="2.5" />
        <circle className="gta-m-bolt" cx="50" cy="72" r="2.5" />
        <path className="gta-m-whisker" d="M20 70 Q6 66 8 54" />
        <path className="gta-m-whisker" d="M80 70 Q94 66 92 54" />
        <circle className="gta-m-light gta-m-light-on" cx="38" cy="58" r="5" />
        <circle className="gta-m-light gta-m-light-on" cx="62" cy="58" r="5" />
        <ellipse className="gta-m-exhaust" cx="8" cy="50" rx="4" ry="2.5" />
        <ellipse className="gta-m-exhaust" cx="92" cy="50" rx="4" ry="2.5" />
      </svg>
    </div>
  );
}

export function HaarlemMascot({ className = '' }) {
  return (
    <div className={`mascot-frames ${className}`} role="img" aria-label="Haarlem Festival mascot">
      <svg className="mascot-frame mascot-frame-0" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <ellipse className="haarlem-m-body" cx="50" cy="55" rx="20" ry="18" />
        <path className="haarlem-m-stem" d="M50 73 L50 88" />
        <path className="haarlem-m-leaf" d="M50 80 Q38 78 36 68 Q46 70 50 80Z" />
        <circle className="haarlem-m-eye" cx="44" cy="52" r="2" />
        <circle className="haarlem-m-eye" cx="56" cy="52" r="2" />
        <polygon className="haarlem-m-flag" points="30,42 34,50 26,50" />
        <polygon className="haarlem-m-flag" points="45,38 49,47 41,47" />
        <polygon className="haarlem-m-flag" points="60,38 64,47 56,47" />
        <polygon className="haarlem-m-flag" points="72,42 76,50 68,50" />
      </svg>
      <svg className="mascot-frame mascot-frame-1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <ellipse className="haarlem-m-body" cx="50" cy="55" rx="20" ry="18" />
        <path className="haarlem-m-stem" d="M50 73 L50 88" />
        <path className="haarlem-m-leaf" d="M50 80 Q38 78 36 68 Q46 70 50 80Z" />
        <circle className="haarlem-m-eye" cx="44" cy="52" r="2" />
        <circle className="haarlem-m-eye" cx="56" cy="52" r="2" />
        <polygon className="haarlem-m-flag haarlem-m-flag-active" points="30,40 34,48 26,48" />
        <polygon className="haarlem-m-flag haarlem-m-flag-active" points="45,36 49,45 41,45" />
        <polygon className="haarlem-m-flag haarlem-m-flag-active" points="60,36 64,45 56,45" />
        <polygon className="haarlem-m-flag haarlem-m-flag-active" points="72,40 76,48 68,48" />
      </svg>
      <svg className="mascot-frame mascot-frame-2" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <ellipse className="haarlem-m-body" cx="50" cy="55" rx="20" ry="18" />
        <path className="haarlem-m-stem" d="M50 73 L50 88" />
        <path className="haarlem-m-leaf" d="M50 80 Q38 78 36 68 Q46 70 50 80Z" />
        <circle className="haarlem-m-eye" cx="44" cy="52" r="2" />
        <circle className="haarlem-m-eye" cx="56" cy="52" r="2" />
        <polygon className="haarlem-m-flag haarlem-m-flag-active" points="30,40 34,48 26,48" />
        <polygon className="haarlem-m-flag haarlem-m-flag-active" points="45,36 49,45 41,45" />
        <polygon className="haarlem-m-flag haarlem-m-flag-active" points="60,36 64,45 56,45" />
        <polygon className="haarlem-m-flag haarlem-m-flag-active" points="72,40 76,48 68,48" />
        <circle className="haarlem-m-lantern" cx="30" cy="46" r="2.5" />
        <circle className="haarlem-m-lantern" cx="45" cy="42" r="2.5" />
        <circle className="haarlem-m-lantern" cx="60" cy="42" r="2.5" />
        <circle className="haarlem-m-lantern" cx="72" cy="46" r="2.5" />
      </svg>
    </div>
  );
}

export function SelfhostMascot({ className = '' }) {
  return (
    <div className={`mascot-frames ${className}`} role="img" aria-label="Self-Hosted AI Infrastructure mascot">
      <svg className="mascot-frame mascot-frame-0" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <rect className="selfhost-m-tower" x="30" y="20" width="40" height="70" rx="4" />
        <rect className="selfhost-m-vent" x="36" y="30" width="28" height="3" />
        <rect className="selfhost-m-vent" x="36" y="38" width="28" height="3" />
        <rect className="selfhost-m-vent" x="36" y="46" width="28" height="3" />
        <circle className="selfhost-m-led" cx="40" cy="80" r="2" />
        <path className="selfhost-m-spark selfhost-m-spark-dim" d="M50 55 L44 65 L49 65 L46 75 L58 60 L52 60 Z" />
      </svg>
      <svg className="mascot-frame mascot-frame-1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <rect className="selfhost-m-tower" x="30" y="20" width="40" height="70" rx="4" />
        <rect className="selfhost-m-vent" x="36" y="30" width="28" height="3" />
        <rect className="selfhost-m-vent" x="36" y="38" width="28" height="3" />
        <rect className="selfhost-m-vent" x="36" y="46" width="28" height="3" />
        <circle className="selfhost-m-led" cx="40" cy="80" r="2" />
        <path className="selfhost-m-spark selfhost-m-spark-mid" d="M50 55 L44 65 L49 65 L46 75 L58 60 L52 60 Z" />
      </svg>
      <svg className="mascot-frame mascot-frame-2" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <rect className="selfhost-m-tower" x="30" y="20" width="40" height="70" rx="4" />
        <rect className="selfhost-m-vent" x="36" y="30" width="28" height="3" />
        <rect className="selfhost-m-vent" x="36" y="38" width="28" height="3" />
        <rect className="selfhost-m-vent" x="36" y="46" width="28" height="3" />
        <circle className="selfhost-m-led" cx="40" cy="80" r="2" />
        <path className="selfhost-m-spark selfhost-m-spark-full" d="M50 55 L44 65 L49 65 L46 75 L58 60 L52 60 Z" />
        <circle className="selfhost-m-fan" cx="50" cy="35" r="8" />
      </svg>
    </div>
  );
}

export function SomerinMascot({ className = '' }) {
  return (
    <div className={`mascot-frames ${className}`} role="img" aria-label="Somerin mascot">
      <svg className="mascot-frame mascot-frame-0" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <ellipse className="somerin-m-body" cx="50" cy="55" rx="22" ry="15" />
        <circle className="somerin-m-head" cx="72" cy="48" r="10" />
        <circle className="somerin-m-eye" cx="75" cy="46" r="1.6" />
        <polygon className="somerin-m-beak" points="82,48 90,50 82,52" />
        <path className="somerin-m-bandana" d="M62 42 L70 38 L70 46 Z" />
        <path className="somerin-m-wing" d="M35 55 Q22 55 20 60" />
      </svg>
      <svg className="mascot-frame mascot-frame-1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <ellipse className="somerin-m-body" cx="50" cy="55" rx="22" ry="15" />
        <circle className="somerin-m-head" cx="72" cy="48" r="10" />
        <circle className="somerin-m-eye" cx="75" cy="46" r="1.6" />
        <polygon className="somerin-m-beak" points="82,48 90,50 82,52" />
        <path className="somerin-m-bandana" d="M62 42 L70 37 L71 46 Z" />
        <path className="somerin-m-wing" d="M35 55 Q16 52 14 58" />
      </svg>
      <svg className="mascot-frame mascot-frame-2" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <ellipse className="somerin-m-body" cx="50" cy="55" rx="22" ry="15" />
        <circle className="somerin-m-head" cx="72" cy="48" r="10" />
        <circle className="somerin-m-eye" cx="75" cy="46" r="1.6" />
        <polygon className="somerin-m-beak" points="82,48 90,50 82,52" />
        <path className="somerin-m-bandana somerin-m-bandana-flap" d="M62 42 L72 35 L73 46 Z" />
        <path className="somerin-m-wing somerin-m-wing-open" d="M35 55 Q10 48 8 56 Q10 62 20 60" />
      </svg>
    </div>
  );
}

export function SoulsMascot({ className = '' }) {
  return (
    <div className={`mascot-frames ${className}`} role="img" aria-label="Souls Within mascot">
      <svg className="mascot-frame mascot-frame-0" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <path className="souls-m-body souls-m-body-faint" d="M50 30 Q70 30 70 55 Q70 65 60 65 Q65 72 58 72 Q60 78 50 75 Q40 78 42 72 Q35 72 40 65 Q30 65 30 55 Q30 30 50 30 Z" />
        <circle className="souls-m-eye" cx="43" cy="50" r="3" />
        <circle className="souls-m-eye" cx="57" cy="50" r="3" />
      </svg>
      <svg className="mascot-frame mascot-frame-1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <path className="souls-m-body souls-m-body-mid" d="M50 30 Q70 30 70 55 Q70 65 60 65 Q65 72 58 72 Q60 78 50 75 Q40 78 42 72 Q35 72 40 65 Q30 65 30 55 Q30 30 50 30 Z" />
        <circle className="souls-m-eye" cx="43" cy="50" r="3" />
        <circle className="souls-m-eye" cx="57" cy="50" r="3" />
      </svg>
      <svg className="mascot-frame mascot-frame-2" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <path className="souls-m-body souls-m-body-full" d="M50 30 Q70 30 70 55 Q70 65 60 65 Q65 72 58 72 Q60 78 50 75 Q40 78 42 72 Q35 72 40 65 Q30 65 30 55 Q30 30 50 30 Z" />
        <circle className="souls-m-eye souls-m-eye-glow" cx="43" cy="50" r="3" />
        <circle className="souls-m-eye souls-m-eye-glow" cx="57" cy="50" r="3" />
      </svg>
    </div>
  );
}

export function ChapeauMascot({ className = '' }) {
  return (
    <div className={`mascot-frames ${className}`} role="img" aria-label="Chapeau POS mascot">
      <svg className="mascot-frame mascot-frame-0" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <ellipse className="chapeau-m-body" cx="50" cy="58" rx="16" ry="20" />
        <circle className="chapeau-m-head" cx="50" cy="34" r="13" />
        <polygon className="chapeau-m-crest" points="38,26 50,12 62,26" />
        <circle className="chapeau-m-eye" cx="45" cy="32" r="2" />
        <polygon className="chapeau-m-beak" points="50,38 56,40 50,42" />
      </svg>
      <svg className="mascot-frame mascot-frame-1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <ellipse className="chapeau-m-body" cx="50" cy="58" rx="16" ry="20" />
        <circle className="chapeau-m-head" cx="50" cy="34" r="13" />
        <polygon className="chapeau-m-crest" points="38,26 50,11 62,26" />
        <circle className="chapeau-m-eye" cx="45" cy="32" r="2" />
        <polygon className="chapeau-m-beak" points="50,37 60,41 50,45" />
      </svg>
      <svg className="mascot-frame mascot-frame-2" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <ellipse className="chapeau-m-body" cx="50" cy="58" rx="16" ry="20" />
        <circle className="chapeau-m-head" cx="50" cy="34" r="13" />
        <polygon className="chapeau-m-crest chapeau-m-crest-raised" points="38,26 50,8 62,26" />
        <circle className="chapeau-m-eye" cx="45" cy="32" r="2" />
        <polygon className="chapeau-m-beak" points="50,36 63,42 50,48" />
        <path className="chapeau-m-note" d="M70 20 q3 -6 6 0 l0 10" />
      </svg>
    </div>
  );
}

export function GreenhouseMascot({ className = '' }) {
  return (
    <div className={`mascot-frames ${className}`} role="img" aria-label="Greenhouse Automation mascot">
      <svg className="mascot-frame mascot-frame-0" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <circle className="greenhouse-m-seed" cx="50" cy="55" r="16" />
        <path className="greenhouse-m-face" d="M44 52 q2 -2 4 0" />
        <path className="greenhouse-m-face" d="M52 52 q2 -2 4 0" />
        <path className="greenhouse-m-wire" d="M34 55 Q50 75 66 55 Q50 40 34 55Z" />
      </svg>
      <svg className="mascot-frame mascot-frame-1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <circle className="greenhouse-m-seed" cx="50" cy="55" r="16" />
        <path className="greenhouse-m-face" d="M44 52 q2 -2 4 0" />
        <path className="greenhouse-m-face" d="M52 52 q2 -2 4 0" />
        <path className="greenhouse-m-wire greenhouse-m-wire-active" d="M34 55 Q50 75 66 55 Q50 40 34 55Z" />
      </svg>
      <svg className="mascot-frame mascot-frame-2" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <circle className="greenhouse-m-seed" cx="50" cy="55" r="16" />
        <path className="greenhouse-m-face" d="M44 51 q2 -3 4 0" />
        <path className="greenhouse-m-face" d="M52 51 q2 -3 4 0" />
        <path className="greenhouse-m-wire greenhouse-m-wire-active" d="M34 55 Q50 75 66 55 Q50 40 34 55Z" />
        <path className="greenhouse-m-droplet" d="M50 26 Q54 34 50 38 Q46 34 50 26Z" />
        <path className="greenhouse-m-sprout" d="M50 39 Q46 34 50 30 Q54 34 50 39Z" />
      </svg>
    </div>
  );
}

export function MovieMascot({ className = '' }) {
  return (
    <div className={`mascot-frames ${className}`} role="img" aria-label="Movie Theater Ticketing mascot">
      <svg className="mascot-frame mascot-frame-0" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <circle className="movie-m-ring" cx="50" cy="35" r="14" />
        <circle className="movie-m-eye" cx="45" cy="35" r="1.8" />
        <circle className="movie-m-eye" cx="55" cy="35" r="1.8" />
        <rect className="movie-m-stub" x="40" y="55" width="8" height="14" rx="1" />
        <rect className="movie-m-stub" x="52" y="58" width="8" height="14" rx="1" />
      </svg>
      <svg className="mascot-frame mascot-frame-1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <circle className="movie-m-ring movie-m-ring-turn" cx="50" cy="35" r="14" />
        <circle className="movie-m-eye" cx="46" cy="34" r="1.8" />
        <circle className="movie-m-eye" cx="56" cy="36" r="1.8" />
        <rect className="movie-m-stub" x="39" y="56" width="8" height="14" rx="1" transform="rotate(-4 43 63)" />
        <rect className="movie-m-stub" x="53" y="58" width="8" height="14" rx="1" transform="rotate(4 57 65)" />
      </svg>
      <svg className="mascot-frame mascot-frame-2" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <circle className="movie-m-ring movie-m-ring-turn" cx="50" cy="35" r="14" />
        <circle className="movie-m-eye" cx="46" cy="34" r="1.8" />
        <circle className="movie-m-eye" cx="56" cy="36" r="1.8" />
        <polygon className="movie-m-stub movie-m-stub-torn" points="38,52 48,52 50,60 46,66 42,60 40,66 36,60" />
        <rect className="movie-m-stub" x="53" y="58" width="8" height="14" rx="1" transform="rotate(4 57 65)" />
      </svg>
    </div>
  );
}

export function ServicedeskMascot({ className = '' }) {
  return (
    <div className={`mascot-frames ${className}`} role="img" aria-label="Service Desk Ticket System mascot">
      <svg className="mascot-frame mascot-frame-0" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <path className="servicedesk-m-body" d="M50 25 Q68 25 68 45 Q68 60 58 62 Q60 70 50 68 Q40 70 42 62 Q32 60 32 45 Q32 25 50 25Z" />
        <circle className="servicedesk-m-eye" cx="44" cy="42" r="2" />
        <circle className="servicedesk-m-eye" cx="56" cy="42" r="2" />
        <rect className="servicedesk-m-plaque" x="40" y="70" width="20" height="16" rx="2" />
      </svg>
      <svg className="mascot-frame mascot-frame-1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <path className="servicedesk-m-body" d="M50 25 Q68 25 68 45 Q68 60 58 62 Q60 70 50 68 Q40 70 42 62 Q32 60 32 45 Q32 25 50 25Z" />
        <circle className="servicedesk-m-eye" cx="44" cy="42" r="2" />
        <circle className="servicedesk-m-eye" cx="56" cy="42" r="2" />
        <rect className="servicedesk-m-plaque servicedesk-m-plaque-active" x="40" y="70" width="20" height="16" rx="2" />
        <line className="servicedesk-m-plaque-line" x1="43" y1="78" x2="57" y2="78" />
      </svg>
      <svg className="mascot-frame mascot-frame-2" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <path className="servicedesk-m-body" d="M50 25 Q68 25 68 45 Q68 60 58 62 Q60 70 50 68 Q40 70 42 62 Q32 60 32 45 Q32 25 50 25Z" />
        <circle className="servicedesk-m-eye" cx="44" cy="42" r="2" />
        <circle className="servicedesk-m-eye" cx="56" cy="42" r="2" />
        <rect className="servicedesk-m-plaque servicedesk-m-plaque-active" x="40" y="70" width="20" height="16" rx="2" />
        <path className="servicedesk-m-plaque-check" d="M44 78 l4 4 l8 -8" />
      </svg>
    </div>
  );
}

export const MASCOTS = {
  jericho: JerichoMascot,
  tulip: TulipMascot,
  impala: ImpalaMascot,
  gta: GtaMascot,
  haarlem: HaarlemMascot,
  selfhost: SelfhostMascot,
  somerin: SomerinMascot,
  souls: SoulsMascot,
  chapeau: ChapeauMascot,
  greenhouse: GreenhouseMascot,
  movie: MovieMascot,
  servicedesk: ServicedeskMascot,
};

export function MascotArt({ id, className = '' }) {
  const MascotComponent = MASCOTS[id];
  if (!MascotComponent) return null;
  return <MascotComponent className={className} />;
}
