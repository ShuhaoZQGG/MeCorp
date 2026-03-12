import type { ApartmentTier } from '../../lib/performance';

interface Props {
  tier: ApartmentTier;
}

const stars = [
  { top: 12, left: 18, size: 3, delay: '0s' },
  { top: 20, left: 90, size: 2, delay: '0.4s' },
  { top: 8, left: 55, size: 2, delay: '0.8s' },
  { top: 32, left: 30, size: 2, delay: '1.2s' },
  { top: 18, left: 110, size: 3, delay: '0.6s' },
];

const rainStreaks = Array.from({ length: 8 }).map((_, i) => ({
  left: `${8 + i * 11}%`,
  delay: `${i * 0.15}s`,
  duration: `${0.5 + (i % 3) * 0.15}s`,
}));

export default function ApartmentWindow({ tier }: Props) {
  return (
    <div
      className="absolute"
      style={{
        top: '50px',
        left: '80px',
        width: '140px',
        height: '100px',
      }}
    >
      {/* Main frame with night sky */}
      <div
        className="absolute inset-0"
        style={{
          border: '4px solid #5a3d2b',
          borderRadius: '2px',
          background: 'linear-gradient(180deg, #1a1a3e 0%, #2d1b69 100%)',
          overflow: 'hidden',
        }}
      >
        {/* Moonlight glow — good tier only */}
        {tier === 'good' && (
          <div
            style={{
              position: 'absolute',
              top: '-20px',
              right: '-10px',
              width: '80px',
              height: '80px',
              background: 'radial-gradient(circle at 60% 40%, rgba(255,255,220,0.25) 0%, rgba(200,200,180,0.08) 50%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Stars — good tier only */}
        {tier === 'good' &&
          stars.map((star, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: star.top,
                left: star.left,
                width: `${star.size}px`,
                height: `${star.size}px`,
                background: i % 2 === 0 ? '#ffffcc' : '#ffffff',
                imageRendering: 'pixelated',
                animation: `twinkle ${1.2 + i * 0.3}s ease-in-out ${star.delay} infinite`,
              }}
            />
          ))}

        {/* Moon — good tier */}
        {tier === 'good' && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              right: '14px',
              width: '14px',
              height: '14px',
              background: '#f7eebb',
              borderRadius: '50%',
              boxShadow: '0 0 6px 2px rgba(247,238,187,0.4)',
            }}
          />
        )}

        {/* Rain streaks — poor tier only */}
        {tier === 'poor' && (
          <div
            className="absolute inset-0"
            style={{ overflow: 'hidden', pointerEvents: 'none' }}
          >
            {rainStreaks.map((streak, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: streak.left,
                  width: '1px',
                  height: '30px',
                  background: 'rgba(180,210,255,0.45)',
                  animation: `rain ${streak.duration} linear ${streak.delay} infinite`,
                }}
              />
            ))}
          </div>
        )}

        {/* Vertical cross-bar */}
        <div
          className="absolute"
          style={{
            top: 0,
            bottom: 0,
            left: '50%',
            width: '4px',
            marginLeft: '-2px',
            background: '#5a3d2b',
            zIndex: 2,
          }}
        />
        {/* Horizontal cross-bar */}
        <div
          className="absolute"
          style={{
            left: 0,
            right: 0,
            top: '50%',
            height: '4px',
            marginTop: '-2px',
            background: '#5a3d2b',
            zIndex: 2,
          }}
        />
      </div>

      {/* Window sill */}
      <div
        style={{
          position: 'absolute',
          bottom: '-6px',
          left: '-8px',
          right: '-8px',
          height: '6px',
          background: '#5a3d2b',
          borderRadius: '0 0 2px 2px',
        }}
      />
    </div>
  );
}
