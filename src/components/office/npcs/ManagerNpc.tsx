import NpcSprite from './NpcSprite';
import { useNpcStore } from '../../../store/npcStore';

export default function ManagerNpc() {
  const openDialogue = useNpcStore((s) => s.openNpcDialogue);

  return (
    <NpcSprite
      name="THE BOSS"
      npcType="manager"
      onClick={() => openDialogue('manager')}
      style={{ right: '260px', bottom: '68px', zIndex: 12 }}
    >
      <div style={{ position: 'relative', width: '16px', height: '24px' }}>
        {/* Head */}
        <div style={{
          width: '14px', height: '12px', background: '#f5d6b8',
          borderRadius: '2px', position: 'absolute', top: 0, left: '1px',
        }}>
          {/* Hair (slicked) */}
          <div style={{
            position: 'absolute', top: '-3px', left: 0, right: 0,
            height: '5px', background: '#3d2b5a', borderRadius: '2px 2px 0 0',
          }} />
          {/* Eyes */}
          <div style={{ position: 'absolute', top: '5px', left: '2px', width: '3px', height: '2px', background: '#2a1a0a', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: '5px', right: '2px', width: '3px', height: '2px', background: '#2a1a0a', borderRadius: '50%' }} />
          {/* Stern mouth */}
          <div style={{ position: 'absolute', bottom: '1px', left: '4px', width: '6px', height: '1px', background: '#c85050' }} />
        </div>
        {/* Torso with tie */}
        <div style={{
          position: 'absolute', top: '12px', left: '1px',
          width: '14px', height: '12px', background: '#6b4d8a',
          borderRadius: '0 0 2px 2px',
        }}>
          {/* Tie */}
          <div style={{
            position: 'absolute', top: '0px', left: '50%', transform: 'translateX(-50%)',
            width: '4px', height: '10px', background: '#c0392b',
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 50% 100%, 0% 30%)',
          }} />
        </div>
      </div>
    </NpcSprite>
  );
}
