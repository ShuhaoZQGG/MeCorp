import type { ApartmentTier } from '../../lib/performance';

interface Props {
  tier: ApartmentTier;
}

const floorGradients: Record<ApartmentTier, string> = {
  good: 'linear-gradient(180deg, #8a6a4a 0%, #6a5038 100%)',
  neutral: 'linear-gradient(180deg, #7a6040 0%, #5a4530 100%)',
  poor: 'linear-gradient(180deg, #5a5040 0%, #4a4030 100%)',
};

export default function ApartmentFloor({ tier }: Props) {
  return (
    <div
      className="absolute bottom-0 left-0 right-0"
      style={{
        height: '40%',
        background: floorGradients[tier],
        transition: 'background 2s ease',
        overflow: 'hidden',
      }}
    >
      {/* Horizontal plank lines every ~20px */}
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="absolute left-0 right-0"
          style={{
            top: `${i * 20}px`,
            height: '1px',
            background: 'rgba(0,0,0,0.18)',
          }}
        />
      ))}
      {/* Subtle vertical grain lines */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="absolute top-0 bottom-0"
          style={{
            left: `${(i + 1) * 12.5}%`,
            width: '1px',
            background: 'rgba(0,0,0,0.06)',
          }}
        />
      ))}
    </div>
  );
}
