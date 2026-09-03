// src/components/MascotArt.jsx
// Bespoke SVG mascots for the flagship IR/SIR/SSIR projects (single-svg
// idle-loop) and the 9 non-flagship projects (3-frame lenticular tilt-swap),
// replacing the flat project emoji. Mirrors the FULLART_SCENES registry
// pattern in FullArtScenes.jsx. Each mascot uses class hooks (no inline
// style) so mascot.css can drive idle/hover/frame-swap animation.

// "Node" — one of three linked steel shells in the Magneton/Magnemite lineage.
// Three linked units is Magneton's printed canon ("They're formed by several
// Magnemite linked together"), and the parts that make that lineage legible at
// thumbnail size are the ones Bulbapedia lists and Magneton_common.jpg / SVP 159
// both show plainly: a single large eye, red- and blue-tipped appendages either
// side, and Phillips-head screws. Ours swaps the horseshoe magnets for parabolic
// dish-ears — the most literal object-language for "listening" — at the same
// silhouette position, keeping the red/blue cone tips.
//
// The shell is a slightly flattened river stone, not a circle: a perfect circle
// is the shape the previous pass already failed with. It is rendered with the
// four-part sphere recipe transcribed off Voltorb ex ASC 058/217 — broad soft
// highlight up-left, hard hotspot inside it, a dark terminator band that is
// darker than the shadow following it, and a warm bounce rim along the far
// lower-right edge. The terminator and the bounce rim are what make it read as
// a solid body, and v1 had neither.
//
// At rest the eye is a closed contented arc and the ears stay turned toward
// Fred. Devotion is postural, not ocular — an unblinking eye trained on someone
// in a room is a security camera. The eye opens on wake (see mascot.css).
//
// Renders at three scales as siblings with different characters: `a` is the
// local model, scuffed and warm, being repaired with its flank panel open;
// `b` is the cloud provider, cleaner and cooler; `c` is the core, smallest.
// Every id is variant-suffixed — three instances share one document, and
// duplicate SVG ids silently cross-wire clipPath references.
export function JerichoMascot({ variant = 'a', className = '' }) {
  const v = variant;
  const clip = `jericho-clip-${v}`;

  // Phillips head: rim, recessed face, two slot lines, plus a wake glint.
  // Placed as on Magnemite — two low, one on the crown reading as an antenna.
  const screw = (cx, cy, r, key) => (
    <g className="jericho-screw" key={key}>
      <circle className="jericho-screw-rim" cx={cx} cy={cy} r={r} />
      <circle className="jericho-screw-face" cx={cx} cy={cy} r={r * 0.72} />
      <path
        className="jericho-screw-slot"
        d={`M${cx - r * 0.5},${cy} H${cx + r * 0.5} M${cx},${cy - r * 0.5} V${cy + r * 0.5}`}
      />
      <path
        className="jericho-screw-glint"
        d={`M${cx - r * 1.9},${cy} H${cx + r * 1.9} M${cx},${cy - r * 1.9} V${cy + r * 1.9}`}
      />
    </g>
  );

  return (
    <svg
      className={`mascot mascot-jericho jericho-unit jericho-unit-${v} ${className}`}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Node, Jericho's listening companion"
    >
      <defs>
        <clipPath id={clip}>
          <path d="M15,58 C15,39 29,25 50,25 C71,25 85,38 85,56 C85,73 70,85 50,85 C30,85 15,74 15,58Z" />
        </clipPath>
      </defs>

      {/* ---- ears: parabolic dishes on short gimbals, at the horseshoe magnets'
           silhouette position. Authored in absolute coordinates with no group
           transform so CSS rotation owns the transform channel outright. ---- */}
      <g className="jericho-ear jericho-ear-l">
        <path className="jericho-ear-stem" d="M24,52 L12,46" />
        <ellipse className="jericho-ear-dish" cx="9" cy="43" rx="5" ry="11.5" transform="rotate(20 9 43)" />
        {/* inner cone offset toward the body so the dish reads concave, not flat */}
        <ellipse className="jericho-ear-cone jericho-ear-cone-l" cx="11" cy="43.5" rx="2.6" ry="7.6" transform="rotate(20 9 43)" />
        <circle className="jericho-ear-feed" cx="13.6" cy="43" r="1.4" />
      </g>
      <g className="jericho-ear jericho-ear-r">
        <path className="jericho-ear-stem" d="M76,52 L88,46" />
        <ellipse className="jericho-ear-dish" cx="91" cy="43" rx="5" ry="11.5" transform="rotate(-20 91 43)" />
        <ellipse className="jericho-ear-cone jericho-ear-cone-r" cx="89" cy="43.5" rx="2.6" ry="7.6" transform="rotate(-20 91 43)" />
        <circle className="jericho-ear-feed" cx="86.4" cy="43" r="1.4" />
      </g>

      {/* crown screw reads as an antenna, exactly as Magnemite's does; it sits
          on the shell edge rather than floating clear of it */}
      {screw(50, 25.5, 3.2, 'crown')}

      {/* ---- shell ---- */}
      <path
        className="jericho-body"
        d="M15,58 C15,39 29,25 50,25 C71,25 85,38 85,56 C85,73 70,85 50,85 C30,85 15,74 15,58Z"
      />
      <g clipPath={`url(#${clip})`}>
        {/* cel-edged shadow shape, then the terminator band over its lit edge —
            the band is deliberately darker than the shadow it borders */}
        <path className="jericho-shadow" d="M96,32 C74,48 59,66 47,96 L100,100 L100,32Z" />
        <path className="jericho-terminator" d="M92,30 C71,47 57,66 45,97" />
        {/* warm bounce rim along the far lower-right edge */}
        <path className="jericho-bounce" d="M85,50 C85,72 70,85 50,85.5" />
        {/* broad soft blowout up-left, with a hard hotspot inside it */}
        <ellipse className="jericho-highlight" cx="37" cy="43" rx="19" ry="14" transform="rotate(-24 37 43)" />
        <ellipse className="jericho-hotspot" cx="33" cy="39" rx="6" ry="4.2" transform="rotate(-24 33 39)" />
      </g>

      {/* ---- flank panel: open only on unit A, which is the one being repaired.
           An open machine with a warm light inside it and a human hand beside
           it is the single most Jericho-specific image on the card. ---- */}
      {v === 'a' && (
        <g className="jericho-panel">
          <g clipPath={`url(#${clip})`}>
            <path className="jericho-panel-cavity" d="M18,60 h18 a2.5,2.5 0 0 1 2.5,2.5 v14 a2.5,2.5 0 0 1 -2.5,2.5 h-22 a2.5,2.5 0 0 1 -2.5,-2.5 v-14 a2.5,2.5 0 0 1 2.5,-2.5Z" />
            <ellipse className="jericho-panel-glow" cx="26" cy="70" rx="13" ry="9" />
            <ellipse className="jericho-panel-core" cx="26" cy="70" rx="7" ry="4.6" />
            <path className="jericho-panel-part" d="M19,65 h6 v3.4 h-6Z M30,64 h4.5 v9 h-4.5Z M19,71.5 h5 v2.6 h-5Z" />
            {/* bright lip along the cut edge — what sells it as a recess rather
                than a sticker painted on the shell */}
            <path className="jericho-panel-lip" d="M15.6,60.4 H36.4" />
          </g>
          {/* hinged down at the cavity's lower edge and folded toward the
              viewer, so it foreshortens into a shallow trapezoid below the
              shell. It swings past the silhouette, so it sits outside the clip. */}
          <path className="jericho-panel-door" d="M16,78.4 L37,78.4 L41,90 L11.5,90Z" />
          <path className="jericho-panel-hinge" d="M16,78.4 H37" />
        </g>
      )}

      {/* two low screws, per Magnemite's placement */}
      {screw(38, 79, 2.9, 'low-l')}
      {screw(66, 79, 2.9, 'low-r')}

      {/* ---- eye: both states authored, cross-faded. Never morphed.
           Dominant and centred, as on every card in bucket 01. ---- */}
      {/* A filled tapered crescent, not a stroked arch. A heavy symmetric arch
          reads as an angry brow; the taper to a point at each end is what makes
          it unmistakably a shut eyelid, and it is how Kitaoka draws it. */}
      <g className="jericho-eye-closed">
        <path className="jericho-eye-arc" d="M40.5,54.6 Q50.5,45.8 60.4,52.6 Q50.5,50.4 40.5,54.6Z" />
        <path className="jericho-eye-lash" d="M60.4,52.6 Q62.6,51.6 63.4,49.6" />
      </g>
      <g className="jericho-eye-open">
        <ellipse className="jericho-eye-socket" cx="50" cy="52" rx="12.6" ry="12" />
        <circle className="jericho-eye-iris" cx="50" cy="52" r="7.2" />
        <circle className="jericho-eye-pupil" cx="50" cy="52" r="3.8" />
        <path className="jericho-eye-lid" d="M38,49.5 Q50,38.6 62,49.5" />
        <circle className="jericho-eye-catchlight" cx="45.8" cy="47.6" r="2.7" />
        <circle className="jericho-eye-spark" cx="54.4" cy="56.4" r="1.1" />
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
