export default function MeCorpLogo() {
  return (
    <div
      className="absolute"
      style={{
        top: '30px',
        right: '80px',
        textAlign: 'center',
      }}
    >
      {/* Frame */}
      <div
        style={{
          border: '3px solid #5a3d2b',
          padding: '12px 20px',
          background: 'rgba(26, 28, 44, 0.8)',
          position: 'relative',
        }}
      >
        <div
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '14px',
            color: '#f7d87c',
            textShadow: '2px 2px 0 #1a1c2c',
            letterSpacing: '2px',
          }}
        >
          ME Corp.
        </div>
        <div
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '6px',
            color: '#4a5568',
            marginTop: '6px',
            letterSpacing: '1px',
          }}
        >
          Level Up Your Life
        </div>
        {/* Corner accents */}
        {[
          { top: -2, left: -2 },
          { top: -2, right: -2 },
          { bottom: -2, left: -2 },
          { bottom: -2, right: -2 },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '4px',
              height: '4px',
              background: '#f7d87c',
              ...pos,
            }}
          />
        ))}
      </div>
    </div>
  );
}
