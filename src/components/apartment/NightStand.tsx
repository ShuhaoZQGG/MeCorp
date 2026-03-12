import type { ApartmentTier } from '../../lib/performance';

interface Props {
  tier: ApartmentTier;
}

export default function NightStand({ tier }: Props) {
  const isGood = tier === 'good';
  const isPoor = tier === 'poor';

  return (
    <div
      className="absolute"
      style={{
        right: '185px',
        bottom: '150px',
        width: '30px',
        height: '28px',
        imageRendering: 'pixelated',
      }}
    >
      {/* Table surface */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '5px',
          background: '#5a3d2b',
          borderRadius: '1px',
        }}
      />

      {/* Table body */}
      <div
        style={{
          position: 'absolute',
          top: '5px',
          left: '2px',
          right: '2px',
          bottom: 0,
          background: isPoor ? '#4a3020' : '#6b4e35',
          borderRadius: '0 0 2px 2px',
        }}
      />

      {/* Good: tiny lamp on top */}
      {!isPoor && (
        <div
          style={{
            position: 'absolute',
            top: '-8px',
            left: '4px',
            width: '8px',
            height: '8px',
            background: isGood ? '#f7d87c' : '#c0a060',
            borderRadius: '50%',
            boxShadow: isGood
              ? '0 0 6px 3px rgba(247,216,124,0.5)'
              : 'none',
            transition: 'background 2s ease, box-shadow 2s ease',
          }}
        />
      )}

      {/* Good: alarm clock */}
      {isGood && (
        <div
          style={{
            position: 'absolute',
            top: '-7px',
            right: '3px',
            width: '9px',
            height: '8px',
            background: '#2a2a3a',
            borderRadius: '1px',
          }}
        >
          {/* Clock face green dot */}
          <div
            style={{
              position: 'absolute',
              top: '2px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '3px',
              height: '3px',
              borderRadius: '50%',
              background: '#38b764',
            }}
          />
        </div>
      )}

      {/* Poor: cluttered items */}
      {isPoor && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '-6px',
              left: '2px',
              width: '10px',
              height: '6px',
              background: '#4a4030',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '-10px',
              left: '8px',
              width: '8px',
              height: '8px',
              background: '#5a4838',
              transform: 'rotate(5deg)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '-12px',
              right: '4px',
              width: '6px',
              height: '10px',
              background: '#6a5848',
              transform: 'rotate(-8deg)',
            }}
          />
        </>
      )}
    </div>
  );
}
