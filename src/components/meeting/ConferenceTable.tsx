export default function ConferenceTable() {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '60px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '200px',
        height: '40px',
        zIndex: 10,
      }}
    >
      {/* Table top */}
      <div
        style={{
          width: '100%',
          height: '16px',
          background: '#5a3a10',
          border: '2px solid #3d2b1f',
          borderBottom: 'none',
        }}
      />
      {/* Table front face */}
      <div
        style={{
          width: '100%',
          height: '24px',
          background: '#4a2e0a',
          border: '2px solid #3d2b1f',
          borderTop: 'none',
        }}
      />
    </div>
  );
}
