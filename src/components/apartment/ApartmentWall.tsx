import type { ApartmentTier } from '../../lib/performance';

interface Props {
  tier: ApartmentTier;
}

const wallGradients: Record<ApartmentTier, string> = {
  good: 'linear-gradient(180deg, #d4a373 0%, #c77b58 100%)',
  neutral: 'linear-gradient(180deg, #b8926a 0%, #a0785a 100%)',
  poor: 'linear-gradient(180deg, #8a7a6a 0%, #6a5a4a 100%)',
};

export default function ApartmentWall({ tier }: Props) {
  return (
    <div
      className="absolute left-0 right-0 top-0"
      style={{
        bottom: '40%',
        background: wallGradients[tier],
        transition: 'background 2s ease',
      }}
    >
      {/* Wallpaper diamond/dot pattern using repeating background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
          backgroundPosition: '0 0',
          pointerEvents: 'none',
        }}
      />
      {/* Secondary diagonal diamond overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
          backgroundPosition: '8px 8px',
          pointerEvents: 'none',
        }}
      />
      {/* Baseboard */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '8px',
          background: '#5a3d2b',
          borderTop: '2px solid #7a5a3a',
        }}
      />
    </div>
  );
}
