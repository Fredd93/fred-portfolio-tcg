// src/components/TrainerArt.jsx
// Bespoke flat-vector "trainer" illustrations for the 2 Supporter cards.
// Kept separate from MascotArt.jsx — these are human Trainer figures, not
// creature mascots. Mirrors MascotArt's { id } -> component resolver
// contract exactly. Static only, no animation.

export function EcommerceTrainerArt({ className = '' }) {
  return (
    <svg
      className={`trainer-art trainer-art-ecommerce ${className}`}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="E-Commerce Manager trainer, standing at a shop counter with a laptop"
    >
      <polygon className="ecom-t-roof" points="15,45 15,30 30,18 45,30 45,45" />
      <path className="ecom-t-torso" d="M40 90 Q40 55 50 55 Q60 55 60 90 Z" />
      <path className="ecom-t-arm" d="M40 65 Q28 68 26 78" />
      <path className="ecom-t-arm" d="M60 65 Q52 72 48 78" />
      <rect className="ecom-t-counter" x="25" y="68" width="50" height="12" rx="1" />
      <rect className="ecom-t-laptop" x="48" y="58" width="14" height="10" rx="1" />
      <line className="ecom-t-laptop-line" x1="50" y1="63" x2="60" y2="63" />
      <circle className="ecom-t-head" cx="50" cy="45" r="11" />
      <path className="ecom-t-hair" d="M38 40 Q40 28 50 26 Q60 28 62 40 Q64 33 59 30 Q54 24 50 25 Q46 24 41 30 Q36 33 38 40Z" />
      <path className="ecom-t-hair-wisp" d="M37 37 q3 -5 5 -2" />
      <path className="ecom-t-hair-wisp" d="M63 37 q-3 -5 -5 -2" />
      <rect className="ecom-t-glasses" x="40" y="44" width="8" height="6" rx="2" />
      <rect className="ecom-t-glasses" x="52" y="44" width="8" height="6" rx="2" />
      <line className="ecom-t-glasses" x1="48" y1="47" x2="52" y2="47" />
      <path className="ecom-t-stubble" d="M45 52 q5 3 10 0" />
    </svg>
  );
}

export function ItilTrainerArt({ className = '' }) {
  return (
    <svg
      className={`trainer-art trainer-art-itil ${className}`}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="ITIL 4 to 5 Transition trainer, mid-presentation gesture"
    >
      <path className="itil-t-torso" d="M40 90 Q40 55 50 55 Q60 55 60 90 Z" />
      <path className="itil-t-arm-rest" d="M40 65 Q35 75 33 85" />
      <path className="itil-t-arm-raised" d="M60 65 Q75 55 82 40" />
      <circle className="itil-t-hand" cx="82" cy="40" r="4" />
      <path className="itil-t-motion-a" d="M86 26 Q94 40 86 54" />
      <path className="itil-t-motion-b" d="M91 20 Q100 40 91 60" />
      <circle className="itil-t-head" cx="50" cy="45" r="11" />
      <path className="itil-t-hair" d="M38 40 Q40 28 50 26 Q60 28 62 40 Q64 33 59 30 Q54 24 50 25 Q46 24 41 30 Q36 33 38 40Z" />
      <path className="itil-t-hair-wisp" d="M37 37 q3 -5 5 -2" />
      <path className="itil-t-hair-wisp" d="M63 37 q-3 -5 -5 -2" />
      <rect className="itil-t-glasses" x="40" y="44" width="8" height="6" rx="2" />
      <rect className="itil-t-glasses" x="52" y="44" width="8" height="6" rx="2" />
      <line className="itil-t-glasses" x1="48" y1="47" x2="52" y2="47" />
      <path className="itil-t-stubble" d="M45 52 q5 3 10 0" />
    </svg>
  );
}

export const TRAINER_ART = {
  ecommerce: EcommerceTrainerArt,
  itil: ItilTrainerArt,
};

export function TrainerArt({ id, className }) {
  const Art = TRAINER_ART[id];
  return Art ? <Art className={className} /> : null;
}

export default TrainerArt;
