import { useState } from 'react';
import Wall from './Wall';
import Window from './Window';
import MeCorpLogo from './MeCorpLogo';
import Bookshelf from './Bookshelf';
import Desk from './Desk';
import Monitor from './Monitor';
import Plant from './Plant';
import Character from './Character';
import TaskClipboard from './TaskClipboard';
import SupportiveNpc from './npcs/SupportiveNpc';
import ConcernedNpc from './npcs/ConcernedNpc';
import CompetitiveNpc from './npcs/CompetitiveNpc';
import ManagerNpc from './npcs/ManagerNpc';
import NpcDialogueManager from './NpcDialogueManager';
import NewsTicker from './NewsTicker';
import TrophyCase from '../ui/TrophyCase';
import { useGameStore } from '../../store/gameStore';

export default function OfficeScene() {
  const shiftActive = useGameStore((s) => s.shiftActive);
  const setScreen = useGameStore((s) => s.setScreen);
  const [showTrophyCase, setShowTrophyCase] = useState(false);

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ imageRendering: 'pixelated' }}
    >
      <Wall />
      <Window />
      <MeCorpLogo />
      <Bookshelf />
      <Desk />
      <Monitor />
      <Character />
      <Plant />
      <TaskClipboard />

      {/* Office NPCs */}
      <SupportiveNpc />
      <ConcernedNpc />
      <CompetitiveNpc />
      <ManagerNpc />
      <NpcDialogueManager />
      <NewsTicker />

      {/* Goals bulletin board button */}
      <div
        onClick={() => setScreen('goals')}
        style={{
          position: 'absolute',
          right: '40px',
          top: '80px',
          width: '64px',
          height: '48px',
          background: '#5a3a10',
          border: '3px solid #3d2b1f',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2px',
          zIndex: 15,
          transition: 'filter 200ms ease',
          imageRendering: 'pixelated',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1.3)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1)'; }}
      >
        {/* Pins */}
        <div style={{ display: 'flex', gap: '16px', position: 'absolute', top: '4px' }}>
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#e76f51' }} />
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#38b764' }} />
        </div>
        {/* Paper notes */}
        <div style={{ width: '24px', height: '6px', background: '#f5e6c8', marginTop: '6px' }} />
        <div style={{ width: '20px', height: '6px', background: '#f5e6c8' }} />
        {/* Label */}
        <span
          style={{
            fontSize: '5px',
            fontFamily: "'Press Start 2P', monospace",
            color: '#f7d87c',
            userSelect: 'none',
            marginTop: '2px',
          }}
        >
          GOALS
        </span>
      </div>

      {/* History button (calendar on wall) */}
      <div
        onClick={() => setScreen('history')}
        style={{
          position: 'absolute',
          right: '40px',
          top: '140px',
          width: '40px',
          height: '36px',
          background: '#f5e6c8',
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
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1.2)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1)'; }}
      >
        {/* Calendar grid lines */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <div style={{ width: '4px', height: '4px', background: '#e76f51' }} />
          <div style={{ width: '4px', height: '4px', background: '#8b6914' }} />
          <div style={{ width: '4px', height: '4px', background: '#8b6914' }} />
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <div style={{ width: '4px', height: '4px', background: '#8b6914' }} />
          <div style={{ width: '4px', height: '4px', background: '#38b764' }} />
          <div style={{ width: '4px', height: '4px', background: '#8b6914' }} />
        </div>
        <span
          style={{
            fontSize: '4px',
            fontFamily: "'Press Start 2P', monospace",
            color: '#5a3a10',
            userSelect: 'none',
            marginTop: '1px',
          }}
        >
          LOG
        </span>
      </div>

      {/* Shop button (cash register) */}
      <div
        onClick={() => setScreen('shop')}
        style={{
          position: 'absolute',
          right: '40px',
          top: '195px',
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
        {/* Register buttons */}
        <div style={{ display: 'flex', gap: '2px' }}>
          <div style={{ width: '4px', height: '4px', background: '#f7d87c', borderRadius: '1px' }} />
          <div style={{ width: '4px', height: '4px', background: '#f7d87c', borderRadius: '1px' }} />
          <div style={{ width: '4px', height: '4px', background: '#f7d87c', borderRadius: '1px' }} />
        </div>
        {/* Drawer */}
        <div style={{ width: '28px', height: '6px', background: '#8b6914', borderRadius: '1px', marginTop: '2px' }} />
        <span style={{ fontSize: '4px', fontFamily: "'Press Start 2P', monospace", color: '#f7d87c', userSelect: 'none' }}>
          SHOP
        </span>
      </div>

      {/* Trophy shelf click zone (overlays the Bookshelf area) */}
      <div
        onClick={() => setShowTrophyCase(true)}
        style={{
          position: 'absolute',
          top: '100px',
          left: '60px',
          width: '120px',
          height: '90px',
          cursor: 'pointer',
          zIndex: 16,
        }}
        title="Trophy Case"
      />
      {showTrophyCase && <TrophyCase onClose={() => setShowTrophyCase(false)} />}

      {/* Shift brightness overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'rgba(247, 216, 124, 0.05)',
          opacity: shiftActive ? 1 : 0,
          transition: 'opacity 500ms ease',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />

      {/* Floor */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '60px',
          background: 'linear-gradient(180deg, #3d2b1f 0%, #2d1f15 100%)',
        }}
      >
        {/* Floor tile lines */}
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0"
            style={{
              left: `${i * 6.25}%`,
              width: '1px',
              background: 'rgba(90, 61, 43, 0.5)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
