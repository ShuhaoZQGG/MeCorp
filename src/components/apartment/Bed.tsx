import type { ApartmentTier } from '../../lib/performance';

interface Props {
  tier: ApartmentTier;
}

export default function Bed({ tier }: Props) {
  const isGood = tier === 'good';
  const isPoor = tier === 'poor';

  const blanketColor = isPoor ? '#7a6a5a' : isGood ? '#c77b58' : '#a07060';
  const blanketShadow = isPoor ? '#5a4a3a' : isGood ? '#a05a38' : '#805040';
  const pillowColor = isPoor ? '#b0a898' : '#f0ebe0';
  const headboardColor = isPoor ? '#4a3828' : '#5a3d2b';

  return (
    <div
      className="absolute"
      style={{
        right: '60px',
        bottom: '150px',
        width: '120px',
        height: '70px',
        imageRendering: 'pixelated',
        transition: 'filter 2s ease',
      }}
    >
      {/* Headboard */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '28px',
          background: headboardColor,
          borderRadius: '3px 3px 0 0',
          borderBottom: `3px solid ${isPoor ? '#3a2818' : '#3d2b1f'}`,
        }}
      >
        {/* Headboard panel detail */}
        <div
          style={{
            position: 'absolute',
            top: '4px',
            left: '8px',
            right: '8px',
            height: '14px',
            border: `2px solid ${isPoor ? '#3a2818' : '#3d2b1f'}`,
            borderRadius: '1px',
            opacity: 0.5,
          }}
        />
      </div>

      {/* Mattress */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '4px',
          right: '4px',
          height: '44px',
          background: isPoor ? '#6a5a4a' : '#8a7060',
          borderRadius: '2px',
        }}
      />

      {/* Blanket */}
      <div
        style={{
          position: 'absolute',
          bottom: '2px',
          left: '4px',
          right: '4px',
          height: '30px',
          background: blanketColor,
          borderRadius: '2px',
          transform: isPoor ? 'skewX(-3deg) skewY(1deg)' : 'none',
          transition: 'background 2s ease, transform 1s ease',
          boxShadow: `inset 0 -4px 0 ${blanketShadow}`,
        }}
      >
        {/* Blanket fold lines */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '10px',
            right: '10px',
            height: '2px',
            background: blanketShadow,
            opacity: 0.5,
            borderRadius: '1px',
          }}
        />
        {isPoor && (
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '20px',
              right: '30px',
              height: '2px',
              background: blanketShadow,
              opacity: 0.5,
              borderRadius: '1px',
              transform: 'rotate(2deg)',
            }}
          />
        )}
      </div>

      {/* Pillow */}
      <div
        style={{
          position: 'absolute',
          bottom: '28px',
          left: '8px',
          width: '36px',
          height: '18px',
          background: pillowColor,
          borderRadius: '3px',
          transform: isPoor ? 'rotate(4deg)' : 'none',
          transition: 'background 2s ease, transform 1s ease',
          boxShadow: `inset 0 -3px 0 rgba(0,0,0,0.1)`,
        }}
      />

      {/* Poor tier: scattered items */}
      {isPoor && (
        <>
          <div
            style={{
              position: 'absolute',
              bottom: '38px',
              right: '18px',
              width: '8px',
              height: '6px',
              background: '#8a6050',
              transform: 'rotate(-12deg)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '44px',
              right: '28px',
              width: '6px',
              height: '4px',
              background: '#7a7060',
              transform: 'rotate(8deg)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '50px',
              right: '12px',
              width: '4px',
              height: '8px',
              background: '#6a5848',
              transform: 'rotate(-5deg)',
            }}
          />
        </>
      )}
    </div>
  );
}
