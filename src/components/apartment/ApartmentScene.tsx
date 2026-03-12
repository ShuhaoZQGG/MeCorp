import { useDailyStore } from '../../store/dailyStore';
import { calculateApartmentTier } from '../../lib/performance';
import { useGameStore } from '../../store/gameStore';

import ApartmentWall from './ApartmentWall';
import ApartmentFloor from './ApartmentFloor';
import ApartmentWindow from './ApartmentWindow';
import ApartmentBookshelf from './ApartmentBookshelf';
import ApartmentCharacter from './ApartmentCharacter';
import Bed from './Bed';
import NightStand from './NightStand';
import KitchenArea from './KitchenArea';
import Rug from './Rug';
import Lamp from './Lamp';
import CatCompanion from './CatCompanion';
import WallDecor from './WallDecor';

export default function ApartmentScene() {
  const shiftHistory = useDailyStore((s) => s.shiftHistory);
  const tier = calculateApartmentTier(shiftHistory);

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ imageRendering: 'pixelated' }}
    >
      {/* Background wall — renders first (behind everything) */}
      <ApartmentWall tier={tier} />

      {/* Floor — renders second */}
      <ApartmentFloor tier={tier} />

      {/* Wall-mounted elements */}
      <ApartmentWindow tier={tier} />
      <ApartmentBookshelf tier={tier} />
      <WallDecor tier={tier} />

      {/* Floor-level furniture */}
      <KitchenArea tier={tier} />
      <Lamp tier={tier} />
      <Bed tier={tier} />
      <NightStand tier={tier} />

      {/* Rug — on floor, below character */}
      <Rug tier={tier} />

      {/* Cat companion */}
      <CatCompanion tier={tier} />

      {/* Character on rug */}
      <ApartmentCharacter tier={tier} />

      {/* Shop button */}
      <div
        onClick={() => useGameStore.getState().setScreen('shop')}
        style={{
          position: 'absolute',
          right: '16px',
          bottom: '80px',
          width: '44px',
          height: '32px',
          background: '#a07818',
          border: '2px solid #8b6914',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1px',
          zIndex: 15,
          transition: 'filter 200ms ease',
          imageRendering: 'pixelated',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1.3)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1)'; }}
      >
        <div style={{ display: 'flex', gap: '2px' }}>
          <div style={{ width: '4px', height: '4px', background: '#f7d87c', borderRadius: '1px' }} />
          <div style={{ width: '4px', height: '4px', background: '#f7d87c', borderRadius: '1px' }} />
          <div style={{ width: '4px', height: '4px', background: '#f7d87c', borderRadius: '1px' }} />
        </div>
        <div style={{ width: '28px', height: '6px', background: '#8b6914', borderRadius: '1px', marginTop: '2px' }} />
        <span style={{ fontSize: '4px', fontFamily: "'Press Start 2P', monospace", color: '#f7d87c', userSelect: 'none' }}>SHOP</span>
      </div>
    </div>
  );
}
