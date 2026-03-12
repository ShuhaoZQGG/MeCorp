import { useShopStore } from '../../store/shopStore';

export default function Desk() {
  const deskLampEquipped = useShopStore((s) => s.getEquippedForSlot('desk-lamp'));

  return (
    <div
      className="absolute"
      style={{
        bottom: '60px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '480px',
      }}
    >
      {/* Desk surface */}
      <div
        style={{
          height: '16px',
          background: 'linear-gradient(180deg, #8b6914 0%, #6b4e12 100%)',
          borderTop: '3px solid #a07818',
          borderRadius: '2px 2px 0 0',
          position: 'relative',
        }}
      >
        {/* Desk edge highlight */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'rgba(247, 216, 124, 0.3)',
          }}
        />
      </div>
      {/* Desk front panel */}
      <div
        style={{
          height: '48px',
          background: 'linear-gradient(180deg, #5a3a10 0%, #4a2e0a 100%)',
          borderLeft: '3px solid #6b4e12',
          borderRight: '3px solid #6b4e12',
          borderBottom: '3px solid #3d2008',
          position: 'relative',
        }}
      >
        {/* Drawer */}
        <div
          style={{
            position: 'absolute',
            right: '24px',
            top: '8px',
            width: '64px',
            height: '32px',
            background: '#4a2e0a',
            border: '2px solid #6b4e12',
            borderRadius: '1px',
          }}
        >
          {/* Drawer handle */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '16px',
              height: '4px',
              background: '#a07818',
              borderRadius: '1px',
            }}
          />
        </div>
      </div>
      {/* Desk legs */}
      <div className="flex justify-between" style={{ padding: '0 16px' }}>
        <div style={{ width: '8px', height: '24px', background: '#4a2e0a' }} />
        <div style={{ width: '8px', height: '24px', background: '#4a2e0a' }} />
      </div>

      {/* Conditional desk lamp */}
      {deskLampEquipped && (
        <div style={{ position: 'absolute', top: '-40px', left: '60px' }}>
          <div style={{ width: '16px', height: '12px', background: '#f7d87c', borderRadius: '8px 8px 0 0', boxShadow: '0 0 8px #f7d87c40' }} />
          <div style={{ width: '4px', height: '16px', background: '#a07818', margin: '0 auto' }} />
          <div style={{ width: '16px', height: '4px', background: '#a07818', borderRadius: '1px' }} />
        </div>
      )}

      {/* Coffee mug on desk surface */}
      <div
        style={{
          position: 'absolute',
          top: '-24px',
          right: '60px',
        }}
      >
        {/* Mug body */}
        <div
          style={{
            width: '16px',
            height: '18px',
            background: '#f0f0f0',
            borderRadius: '0 0 3px 3px',
            position: 'relative',
          }}
        >
          {/* Handle */}
          <div
            style={{
              position: 'absolute',
              right: '-6px',
              top: '4px',
              width: '6px',
              height: '10px',
              border: '2px solid #f0f0f0',
              borderLeft: 'none',
              borderRadius: '0 3px 3px 0',
            }}
          />
          {/* Coffee */}
          <div
            style={{
              position: 'absolute',
              top: '2px',
              left: '2px',
              right: '2px',
              height: '4px',
              background: '#5a3a10',
              borderRadius: '1px',
            }}
          />
        </div>
        {/* Steam */}
        <div
          style={{
            position: 'absolute',
            top: '-8px',
            left: '4px',
            width: '2px',
            height: '6px',
            background: 'rgba(255,255,255,0.3)',
            animation: 'float 2s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '-10px',
            left: '8px',
            width: '2px',
            height: '6px',
            background: 'rgba(255,255,255,0.2)',
            animation: 'float 2s ease-in-out infinite 0.5s',
          }}
        />
      </div>

      {/* Keyboard on desk */}
      <div
        style={{
          position: 'absolute',
          top: '-14px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80px',
          height: '10px',
          background: '#2a2d4a',
          border: '1px solid #4a5568',
          borderRadius: '2px',
        }}
      >
        {/* Key rows */}
        {[0, 4].map((y) => (
          <div
            key={y}
            style={{
              position: 'absolute',
              top: y + 1 + 'px',
              left: '3px',
              right: '3px',
              height: '3px',
              display: 'flex',
              gap: '1px',
            }}
          >
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: '#4a5568',
                  borderRadius: '0.5px',
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
