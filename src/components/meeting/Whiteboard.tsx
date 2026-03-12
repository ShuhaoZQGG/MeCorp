export default function Whiteboard() {
  return (
    <div
      style={{
        position: 'absolute',
        top: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '160px',
        height: '80px',
        background: '#e8e0d0',
        border: '4px solid #8b8b8b',
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '6px',
      }}
    >
      {/* Header text */}
      <div
        style={{
          fontSize: '6px',
          fontFamily: "'Press Start 2P', monospace",
          color: '#2a1a0a',
          marginBottom: '4px',
        }}
      >
        WEEKLY REVIEW
      </div>
      {/* Fake marker lines */}
      <div style={{ width: '80%', height: '2px', background: '#c0392b', marginTop: '4px' }} />
      <div style={{ width: '60%', height: '2px', background: '#2980b9', marginTop: '6px' }} />
      <div style={{ width: '70%', height: '2px', background: '#27ae60', marginTop: '6px' }} />
      {/* Marker tray */}
      <div
        style={{
          position: 'absolute',
          bottom: '-6px',
          width: '60px',
          height: '4px',
          background: '#8b8b8b',
          borderRadius: '0 0 2px 2px',
        }}
      />
    </div>
  );
}
