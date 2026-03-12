import type { ApartmentTier } from '../../lib/performance';

interface Props {
  tier: ApartmentTier;
}

export default function WallDecor({ tier }: Props) {
  const isGood = tier === 'good';
  const isPoor = tier === 'poor';

  const posterColors = isGood
    ? ['#e76f51', '#6abe30', '#87ceeb']
    : isPoor
    ? ['#8a5a40', '#4a7050']
    : ['#b05838', '#507048', '#6080a0'];

  return (
    <>
      {/* Poster 1 */}
      <div
        className="absolute"
        style={{
          top: isPoor ? '78px' : '70px',
          left: '240px',
          width: '16px',
          height: '22px',
          background: posterColors[0],
          border: '2px solid #5a3d2b',
          borderRadius: '1px',
          transform: 'none',
          imageRendering: 'pixelated',
        }}
      >
        {/* Decorative lines inside poster */}
        <div
          style={{
            position: 'absolute',
            top: '3px',
            left: '2px',
            right: '2px',
            height: '2px',
            background: 'rgba(255,255,255,0.3)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '2px',
            right: '4px',
            height: '2px',
            background: 'rgba(255,255,255,0.2)',
          }}
        />
        {/* Pin */}
        <div
          style={{
            position: 'absolute',
            top: '-3px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: '#f7d87c',
          }}
        />
      </div>

      {/* Poster 2 */}
      <div
        className="absolute"
        style={{
          top: isPoor ? '64px' : '60px',
          left: '310px',
          width: '16px',
          height: '20px',
          background: posterColors[1],
          border: '2px solid #5a3d2b',
          borderRadius: '1px',
          /* Poor: one poster crooked */
          transform: isPoor ? 'rotate(5deg)' : 'none',
          imageRendering: 'pixelated',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '3px',
            left: '2px',
            right: '2px',
            height: '2px',
            background: 'rgba(255,255,255,0.25)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '2px',
            right: '2px',
            height: '2px',
            background: 'rgba(255,255,255,0.15)',
          }}
        />
        {/* Pin */}
        <div
          style={{
            position: 'absolute',
            top: '-3px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: '#f7d87c',
          }}
        />
      </div>

      {/* Poster 3 — good and neutral only; poor shows it "fallen" lower */}
      {!isPoor ? (
        <div
          className="absolute"
          style={{
            top: '75px',
            left: '360px',
            width: '14px',
            height: '18px',
            background: posterColors[2],
            border: '2px solid #5a3d2b',
            borderRadius: '1px',
            imageRendering: 'pixelated',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '3px',
              left: '2px',
              right: '2px',
              height: '2px',
              background: 'rgba(255,255,255,0.2)',
            }}
          />
          {/* Pin */}
          <div
            style={{
              position: 'absolute',
              top: '-3px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: '#f7d87c',
            }}
          />
        </div>
      ) : (
        /* Poor: poster fallen — gap below where it was */
        <div
          className="absolute"
          style={{
            top: '100px',
            left: '358px',
            width: '14px',
            height: '18px',
            background: '#6a5a4a',
            border: '2px solid #4a3828',
            borderRadius: '1px',
            transform: 'rotate(90deg)',
            imageRendering: 'pixelated',
          }}
        />
      )}
    </>
  );
}
