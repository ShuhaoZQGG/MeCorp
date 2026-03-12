export default function Window() {
  return (
    <div
      className="absolute"
      style={{
        top: '40px',
        left: '60px',
        width: '160px',
        height: '120px',
      }}
    >
      {/* Frame outer */}
      <div
        className="absolute inset-0"
        style={{
          border: '4px solid #5a3d2b',
          borderRadius: '2px',
          background: 'linear-gradient(180deg, #87ceeb 0%, #b8e4f0 40%, #f7d87c 90%, #e8a84c 100%)',
        }}
      >
        {/* Frame inner cross */}
        <div
          className="absolute"
          style={{
            top: 0,
            bottom: 0,
            left: '50%',
            width: '4px',
            marginLeft: '-2px',
            background: '#5a3d2b',
          }}
        />
        <div
          className="absolute"
          style={{
            left: 0,
            right: 0,
            top: '50%',
            height: '4px',
            marginTop: '-2px',
            background: '#5a3d2b',
          }}
        />
        {/* Clouds */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            width: '24px',
            height: '8px',
            background: 'rgba(255,255,255,0.7)',
            borderRadius: '4px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            width: '32px',
            height: '8px',
            background: 'rgba(255,255,255,0.5)',
            borderRadius: '4px',
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
