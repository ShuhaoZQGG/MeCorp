interface Props {
  side: 'left' | 'right';
}

export default function MeetingChair({ side }: Props) {
  const pos = side === 'left'
    ? { left: '100px', bottom: '50px' }
    : { right: '100px', bottom: '50px' };

  return (
    <div
      style={{
        position: 'absolute',
        ...pos,
        zIndex: 8,
        imageRendering: 'pixelated' as const,
      }}
    >
      {/* Seat */}
      <div
        style={{
          width: '20px',
          height: '8px',
          background: '#4a4a6a',
          borderRadius: '2px',
        }}
      />
      {/* Back */}
      <div
        style={{
          position: 'absolute',
          top: '-12px',
          left: '2px',
          width: '16px',
          height: '14px',
          background: '#5a5a7a',
          borderRadius: '3px 3px 0 0',
        }}
      />
      {/* Legs */}
      <div style={{ position: 'absolute', bottom: '-6px', left: '2px', width: '2px', height: '6px', background: '#3a3a5a' }} />
      <div style={{ position: 'absolute', bottom: '-6px', right: '2px', width: '2px', height: '6px', background: '#3a3a5a' }} />
    </div>
  );
}
