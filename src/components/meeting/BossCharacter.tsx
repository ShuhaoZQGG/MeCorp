export default function BossCharacter() {
  return (
    <div
      style={{
        position: 'absolute',
        top: '130px',
        left: '50%',
        transform: 'translateX(-50%) scale(2)',
        zIndex: 12,
        imageRendering: 'pixelated' as const,
      }}
    >
      <div style={{ position: 'relative', width: '16px', height: '24px' }}>
        {/* Head */}
        <div style={{
          width: '14px', height: '12px', background: '#f5d6b8',
          borderRadius: '2px', position: 'absolute', top: 0, left: '1px',
        }}>
          {/* Hair */}
          <div style={{
            position: 'absolute', top: '-3px', left: 0, right: 0,
            height: '5px', background: '#3d2b5a', borderRadius: '2px 2px 0 0',
          }} />
          {/* Eyes */}
          <div style={{ position: 'absolute', top: '5px', left: '2px', width: '3px', height: '2px', background: '#2a1a0a', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: '5px', right: '2px', width: '3px', height: '2px', background: '#2a1a0a', borderRadius: '50%' }} />
          {/* Glasses overlay */}
          <div style={{ position: 'absolute', top: '4px', left: '0px', width: '14px', height: '5px' }}>
            <div style={{ position: 'absolute', left: '0px', width: '6px', height: '5px', border: '1px solid #f7d87c', borderRadius: '1px' }} />
            <div style={{ position: 'absolute', right: '0px', width: '6px', height: '5px', border: '1px solid #f7d87c', borderRadius: '1px' }} />
            <div style={{ position: 'absolute', top: '2px', left: '6px', width: '2px', height: '1px', background: '#f7d87c' }} />
          </div>
          {/* Mouth */}
          <div style={{ position: 'absolute', bottom: '1px', left: '4px', width: '6px', height: '1px', background: '#c85050' }} />
        </div>
        {/* Torso with suit */}
        <div style={{
          position: 'absolute', top: '12px', left: '1px',
          width: '14px', height: '12px', background: '#2a2d4a',
          borderRadius: '0 0 2px 2px',
        }}>
          {/* Tie */}
          <div style={{
            position: 'absolute', top: '0px', left: '50%', transform: 'translateX(-50%)',
            width: '4px', height: '10px', background: '#c0392b',
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 50% 100%, 0% 30%)',
          }} />
        </div>
      </div>
    </div>
  );
}
