export default function Wall() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background: 'linear-gradient(180deg, #1a1c2c 0%, #252742 40%, #2a2d4a 60%, #333758 100%)',
      }}
    >
      {/* Baseboard */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '8px',
          background: '#3d2b1f',
          borderTop: '2px solid #5a3d2b',
        }}
      />
      {/* Subtle wall texture lines */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, transparent, transparent 63px, rgba(255,255,255,0.1) 63px, rgba(255,255,255,0.1) 64px)',
        }}
      />
    </div>
  );
}
