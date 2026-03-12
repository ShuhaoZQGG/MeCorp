import { useGameStore } from '../../store/gameStore';
import { useShopStore } from '../../store/shopStore';

export default function Plant() {
  const completedCount = useGameStore((s) => s.tasks.filter((t) => t.completed).length);
  const bonsaiEquipped = useShopStore((s) => s.getEquippedForSlot('plant-upgrade'));

  // Plant perks up as tasks are completed
  const leafScale = completedCount >= 6 ? 1.1 : completedCount >= 3 ? 1.05 : 1;
  const centerGreen = completedCount >= 6 ? '#2ed85a' : completedCount >= 3 ? '#3ec96e' : '#38b764';
  const sideGreen = completedCount >= 6 ? '#7dd44a' : completedCount >= 3 ? '#72c63a' : '#6abe30';

  if (bonsaiEquipped) {
    return (
      <div
        className="absolute"
        style={{
          bottom: '76px',
          right: '80px',
        }}
      >
        {/* Bonsai canopy */}
        <div style={{ position: 'relative', width: '32px', height: '28px' }}>
          <div style={{ position: 'absolute', top: 0, left: '6px', width: '20px', height: '18px', background: '#38b764', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: '3px', left: '2px', width: '12px', height: '10px', background: '#6abe30cc', borderRadius: '50%' }} />
          {/* Bonsai trunk */}
          <div style={{ position: 'absolute', bottom: 0, left: '13px', width: '4px', height: '10px', background: '#5a3d2b' }} />
          <div style={{ position: 'absolute', bottom: '4px', left: '10px', width: '3px', height: '5px', background: '#5a3d2b', transform: 'rotate(-20deg)', transformOrigin: 'bottom right' }} />
        </div>
        {/* Bonsai pot */}
        <div
          style={{
            width: '28px',
            height: '20px',
            background: 'linear-gradient(180deg, #c77b58 0%, #a05a38 100%)',
            margin: '0 auto',
            clipPath: 'polygon(10% 0%, 90% 0%, 80% 100%, 20% 100%)',
          }}
        />
        <div
          style={{
            width: '32px',
            height: '4px',
            background: '#c77b58',
            borderRadius: '2px',
            marginTop: '-20px',
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="absolute"
      style={{
        bottom: '76px',
        right: '80px',
      }}
    >
      {/* Leaves */}
      <div style={{ position: 'relative', width: '32px', height: '28px', transform: `scale(${leafScale})`, transformOrigin: 'bottom center', transition: 'transform 500ms ease' }}>
        {/* Center leaf */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '12px',
            width: '8px',
            height: '20px',
            background: centerGreen,
            borderRadius: '4px 4px 0 0',
            animation: 'sway 4s ease-in-out infinite',
            transformOrigin: 'bottom center',
            transition: 'background 500ms ease',
          }}
        />
        {/* Left leaf */}
        <div
          style={{
            position: 'absolute',
            bottom: '4px',
            left: '2px',
            width: '8px',
            height: '16px',
            background: sideGreen,
            borderRadius: '4px 4px 0 0',
            transform: 'rotate(-15deg)',
            animation: 'sway 3.5s ease-in-out infinite 0.3s',
            transformOrigin: 'bottom center',
            transition: 'background 500ms ease',
          }}
        />
        {/* Right leaf */}
        <div
          style={{
            position: 'absolute',
            bottom: '4px',
            right: '2px',
            width: '8px',
            height: '16px',
            background: sideGreen,
            borderRadius: '4px 4px 0 0',
            transform: 'rotate(15deg)',
            animation: 'sway 3.5s ease-in-out infinite 0.6s',
            transformOrigin: 'bottom center',
            transition: 'background 500ms ease',
          }}
        />
        {/* Small leaf */}
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            left: '18px',
            width: '6px',
            height: '10px',
            background: '#2a9d4e',
            borderRadius: '3px 3px 0 0',
            transform: 'rotate(10deg)',
          }}
        />
      </div>
      {/* Pot */}
      <div
        style={{
          width: '28px',
          height: '20px',
          background: 'linear-gradient(180deg, #c77b58 0%, #a05a38 100%)',
          margin: '0 auto',
          clipPath: 'polygon(10% 0%, 90% 0%, 80% 100%, 20% 100%)',
        }}
      />
      {/* Pot rim */}
      <div
        style={{
          width: '32px',
          height: '4px',
          background: '#c77b58',
          borderRadius: '2px',
          marginTop: '-20px',
        }}
      />
    </div>
  );
}
