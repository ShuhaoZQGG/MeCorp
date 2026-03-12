import NpcSprite from './NpcSprite';
import { useNpcStore } from '../../../store/npcStore';

export default function ConcernedNpc() {
  const openDialogue = useNpcStore((s) => s.openNpcDialogue);

  return (
    <NpcSprite
      name="BLAIR"
      npcType="concerned"
      onClick={() => openDialogue('concerned')}
      style={{ right: '160px', bottom: '68px', zIndex: 12 }}
    >
      <div style={{ position: 'relative', width: '16px', height: '24px' }}>
        {/* Head */}
        <div style={{
          width: '14px', height: '12px', background: '#f5d6b8',
          borderRadius: '2px', position: 'absolute', top: 0, left: '1px',
        }}>
          {/* Hair */}
          <div style={{
            position: 'absolute', top: '-3px', left: 0, right: 0,
            height: '6px', background: '#3a5ea8', borderRadius: '2px 2px 0 0',
          }} />
          {/* Glasses */}
          <div style={{ position: 'absolute', top: '4px', left: '0px', width: '14px', height: '5px' }}>
            <div style={{ position: 'absolute', left: '0px', width: '6px', height: '5px', border: '1px solid #8b8b8b', borderRadius: '1px', background: 'rgba(180,210,255,0.3)' }} />
            <div style={{ position: 'absolute', right: '0px', width: '6px', height: '5px', border: '1px solid #8b8b8b', borderRadius: '1px', background: 'rgba(180,210,255,0.3)' }} />
            <div style={{ position: 'absolute', top: '2px', left: '6px', width: '2px', height: '1px', background: '#8b8b8b' }} />
          </div>
          {/* Eyes (behind glasses) */}
          <div style={{ position: 'absolute', top: '5px', left: '2px', width: '2px', height: '2px', background: '#2a1a0a', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: '5px', right: '2px', width: '2px', height: '2px', background: '#2a1a0a', borderRadius: '50%' }} />
        </div>
        {/* Torso */}
        <div style={{
          position: 'absolute', top: '12px', left: '1px',
          width: '14px', height: '12px', background: '#4a7ab5',
          borderRadius: '0 0 2px 2px',
        }} />
      </div>
    </NpcSprite>
  );
}
