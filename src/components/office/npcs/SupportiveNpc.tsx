import NpcSprite from './NpcSprite';
import { useNpcStore } from '../../../store/npcStore';

export default function SupportiveNpc() {
  const openDialogue = useNpcStore((s) => s.openNpcDialogue);

  return (
    <NpcSprite
      name="SUNNY"
      npcType="supportive"
      onClick={() => openDialogue('supportive')}
      style={{ left: '140px', bottom: '68px', zIndex: 12 }}
    >
      {/* Body */}
      <div style={{ position: 'relative', width: '16px', height: '24px' }}>
        {/* Head */}
        <div style={{
          width: '14px', height: '12px', background: '#f5d6b8',
          borderRadius: '2px', position: 'absolute', top: 0, left: '1px',
        }}>
          {/* Hair */}
          <div style={{
            position: 'absolute', top: '-4px', left: '-1px', right: '-1px',
            height: '8px', background: '#38b764', borderRadius: '3px 3px 0 0',
          }} />
          {/* Eyes */}
          <div style={{ position: 'absolute', top: '5px', left: '2px', width: '3px', height: '2px', background: '#2a1a0a', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: '5px', right: '2px', width: '3px', height: '2px', background: '#2a1a0a', borderRadius: '50%' }} />
          {/* Smile */}
          <div style={{ position: 'absolute', bottom: '1px', left: '4px', width: '6px', height: '2px', borderBottom: '2px solid #c85050', borderRadius: '0 0 3px 3px' }} />
        </div>
        {/* Torso */}
        <div style={{
          position: 'absolute', top: '12px', left: '1px',
          width: '14px', height: '12px', background: '#4aa352',
          borderRadius: '0 0 2px 2px',
        }} />
      </div>
    </NpcSprite>
  );
}
