// =============================================================================
// LoadingScreen
//
// Shown while the auth session is being restored on app mount.
// Uses a CSS keyframe spinner without requiring any external dependencies.
// =============================================================================

export default function LoadingScreen({ message }: { message?: string }) {
  const pixelFont = "'Press Start 2P', monospace";

  return (
    <>
      {/*
        The @keyframes rule cannot be written as an inline style on an element,
        so we inject it via a <style> tag.  This keeps the component
        self-contained without adding a CSS file.
      */}
      <style>{`
        @keyframes mecorp-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#1a1c2c',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
        }}
      >
        {/* Pixel-art spinner ring */}
        <div
          style={{
            width: '24px',
            height: '24px',
            border: '3px solid #f7d87c',
            borderTopColor: 'transparent',
            animation: 'mecorp-spin 1s linear infinite',
            imageRendering: 'pixelated',
          }}
        />

        {/* Loading label */}
        <div
          style={{
            fontSize: '8px',
            fontFamily: pixelFont,
            color: '#f7d87c',
            userSelect: 'none',
            letterSpacing: '0.1em',
          }}
        >
          {message || 'LOADING...'}
        </div>
      </div>
    </>
  );
}
