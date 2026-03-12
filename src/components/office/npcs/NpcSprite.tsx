import { useState } from 'react';

interface Props {
  name: string;
  npcType: string;
  onClick: () => void;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export default function NpcSprite({ name, onClick, style, children }: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute',
        cursor: 'pointer',
        imageRendering: 'pixelated' as const,
        animation: 'npc-bob 2.5s ease-in-out infinite',
        transition: 'filter 200ms',
        filter: hovered ? 'brightness(1.3)' : 'brightness(1)',
        ...style,
      }}
    >
      {/* Hover name label */}
      {hovered && (
        <div
          style={{
            position: 'absolute',
            top: '-16px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '5px',
            fontFamily: "'Press Start 2P', monospace",
            color: '#f7d87c',
            whiteSpace: 'nowrap',
            background: '#1a1c2c',
            padding: '2px 4px',
            border: '1px solid #f7d87c',
            zIndex: 20,
          }}
        >
          {name}
        </div>
      )}

      {children}

      {/* Desk prop beneath */}
      <div
        style={{
          position: 'absolute',
          bottom: '-6px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '40px',
          height: '12px',
          background: '#5a3a10',
          border: '2px solid #3d2b1f',
        }}
      />
    </div>
  );
}
