import type { ApartmentTier } from '../../lib/performance';

interface Props {
  tier: ApartmentTier;
}

export default function Lamp({ tier }: Props) {
  const isGood = tier === 'good';
  const isPoor = tier === 'poor';

  const shadeColor = isPoor ? '#4a4038' : isGood ? '#f7d87c' : '#c8a850';
  const poleColor = isPoor ? '#4a3828' : '#5a3d2b';

  return (
    <div
      className="absolute"
      style={{
        left: '200px',
        bottom: '160px',
        imageRendering: 'pixelated',
      }}
    >
      {/* Lampshade — trapezoid via borders */}
      <div
        style={{
          position: 'relative',
          width: '28px',
          height: '18px',
          background: shadeColor,
          clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
          transition: 'background 2s ease',
          boxShadow: isGood
            ? 'inset 0 -3px 0 rgba(200,140,30,0.4)'
            : isPoor
            ? 'none'
            : 'inset 0 -3px 0 rgba(150,100,20,0.3)',
        }}
      />

      {/* Shade rim */}
      <div
        style={{
          width: '28px',
          height: '3px',
          background: isPoor ? '#3a3028' : '#8b6914',
          marginTop: '-1px',
        }}
      />

      {/* Glow beneath shade — good and neutral */}
      {!isPoor && (
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '-10px',
            right: '-10px',
            height: '12px',
            background: isGood
              ? 'radial-gradient(ellipse at center, rgba(247,216,124,0.5) 0%, transparent 70%)'
              : 'radial-gradient(ellipse at center, rgba(200,168,80,0.25) 0%, transparent 70%)',
            animation: isGood ? 'apartment-glow 2.5s ease-in-out infinite' : 'none',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Pole */}
      <div
        style={{
          width: '4px',
          height: '60px',
          background: poleColor,
          margin: '0 auto',
          marginTop: '0',
          transition: 'background 2s ease',
        }}
      />

      {/* Base */}
      <div
        style={{
          width: '18px',
          height: '4px',
          background: isPoor ? '#3a2818' : '#4a3020',
          margin: '0 auto',
          borderRadius: '1px',
        }}
      />
    </div>
  );
}
