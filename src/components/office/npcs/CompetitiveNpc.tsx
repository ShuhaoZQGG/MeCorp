import NpcSprite from './NpcSprite';
import { useNpcStore } from '../../../store/npcStore';

export default function CompetitiveNpc() {
  const openDialogue = useNpcStore((s) => s.openNpcDialogue);

  return (
    <NpcSprite
      name="SPIKE"
      npcType="competitive"
      onClick={() => openDialogue('competitive')}
      style={{ left: '50px', bottom: '68px', zIndex: 12 }}
    >
      <div style={{ position: 'relative', width: '16px', height: '24px' }}>
        {/* Head */}
        <div style={{
          width: '14px', height: '12px', background: '#f5d6b8',
          borderRadius: '2px', position: 'absolute', top: 0, left: '1px',
        }}>
          {/* Spiky hair */}
          <div style={{ position: 'absolute', top: '-6px', left: '1px', width: '3px', height: '6px', background: '#e67e22', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
          <div style={{ position: 'absolute', top: '-8px', left: '5px', width: '4px', height: '8px', background: '#e67e22', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
          <div style={{ position: 'absolute', top: '-5px', right: '1px', width: '3px', height: '5px', background: '#e67e22', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
          {/* Eyes */}
          <div style={{ position: 'absolute', top: '4px', left: '2px', width: '3px', height: '3px', background: '#2a1a0a', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: '4px', right: '2px', width: '3px', height: '3px', background: '#2a1a0a', borderRadius: '50%' }} />
          {/* Smirk */}
          <div style={{ position: 'absolute', bottom: '1px', right: '2px', width: '5px', height: '2px', borderBottom: '2px solid #c85050', borderRadius: '0 0 2px 0' }} />
        </div>
        {/* Torso */}
        <div style={{
          position: 'absolute', top: '12px', left: '1px',
          width: '14px', height: '12px', background: '#d35400',
          borderRadius: '0 0 2px 2px',
        }} />
      </div>
    </NpcSprite>
  );
}
