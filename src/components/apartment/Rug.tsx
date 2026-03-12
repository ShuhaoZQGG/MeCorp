import type { ApartmentTier } from '../../lib/performance';

interface Props {
  tier: ApartmentTier;
}

const rugColors: Record<ApartmentTier, string> = {
  good: '#c77b58',
  neutral: '#a08060',
  poor: '#8a7a6a',
};

const rugShadowColors: Record<ApartmentTier, string> = {
  good: '#a05a38',
  neutral: '#806040',
  poor: '#6a5a50',
};

export default function Rug({ tier }: Props) {
  const color = rugColors[tier];
  const shadow = rugShadowColors[tier];

  return (
    <div
      className="absolute"
      style={{
        bottom: '160px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '140px',
        height: '40px',
        background: color,
        borderRadius: '50%',
        transition: 'background 2s ease, box-shadow 2s ease',
        boxShadow: `inset 0 0 0 6px ${shadow}, inset 0 0 0 10px ${color}, inset 0 0 0 14px ${shadow}`,
        imageRendering: 'pixelated',
      }}
    />
  );
}
