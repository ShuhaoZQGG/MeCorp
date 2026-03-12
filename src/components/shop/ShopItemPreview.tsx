interface Props {
  itemId: string;
}

const PREVIEW_COLORS: Record<string, { primary: string; secondary: string }> = {
  'desk-lamp': { primary: '#f7d87c', secondary: '#a07818' },
  'motivational-poster': { primary: '#e63946', secondary: '#f5e6c8' },
  'widescreen-monitor': { primary: '#2a2d4a', secondary: '#38b764' },
  'gold-trophy': { primary: '#ffd700', secondary: '#a07818' },
  'bonsai': { primary: '#38b764', secondary: '#c77b58' },
  'cozy-couch': { primary: '#8b6914', secondary: '#5a3a10' },
  'retro-tv': { primary: '#2a2d4a', secondary: '#457b9d' },
  'kitchen-upgrade': { primary: '#c0c0c0', secondary: '#808080' },
  'pet-bed': { primary: '#e76f51', secondary: '#c77b58' },
  'balcony-plants': { primary: '#6abe30', secondary: '#38b764' },
  'party-hat': { primary: '#e63946', secondary: '#f7d87c' },
  'business-suit': { primary: '#2a2d4a', secondary: '#4a5568' },
  'cool-shades': { primary: '#1a1c2c', secondary: '#457b9d' },
  'gold-watch': { primary: '#ffd700', secondary: '#a07818' },
  'power-tie': { primary: '#e63946', secondary: '#c8102e' },
};

export default function ShopItemPreview({ itemId }: Props) {
  const colors = PREVIEW_COLORS[itemId] ?? { primary: '#666', secondary: '#444' };

  switch (itemId) {
    case 'desk-lamp':
      return (
        <div style={{ position: 'relative', width: '24px', height: '28px' }}>
          <div style={{ position: 'absolute', top: 0, left: '8px', width: '12px', height: '10px', background: colors.primary, borderRadius: '6px 6px 0 0', boxShadow: `0 0 6px ${colors.primary}40` }} />
          <div style={{ position: 'absolute', top: '10px', left: '11px', width: '3px', height: '12px', background: colors.secondary }} />
          <div style={{ position: 'absolute', bottom: 0, left: '6px', width: '14px', height: '4px', background: colors.secondary, borderRadius: '1px' }} />
        </div>
      );
    case 'motivational-poster':
      return (
        <div style={{ width: '24px', height: '20px', background: colors.secondary, border: `2px solid ${colors.primary}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '16px', height: '3px', background: colors.primary }} />
        </div>
      );
    case 'widescreen-monitor':
      return (
        <div style={{ position: 'relative', width: '28px', height: '22px' }}>
          <div style={{ width: '28px', height: '16px', background: colors.primary, border: '2px solid #1a1c2c', borderRadius: '2px', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: '2px', background: '#0a2a1a' }}>
              <div style={{ position: 'absolute', top: '3px', left: '2px', width: '60%', height: '2px', background: colors.secondary }} />
              <div style={{ position: 'absolute', top: '7px', left: '2px', width: '40%', height: '2px', background: `${colors.secondary}80` }} />
            </div>
          </div>
          <div style={{ width: '8px', height: '3px', background: '#1a1c2c', margin: '0 auto' }} />
          <div style={{ width: '14px', height: '2px', background: '#1a1c2c', margin: '0 auto' }} />
        </div>
      );
    case 'gold-trophy':
      return (
        <div style={{ position: 'relative', width: '20px', height: '26px' }}>
          <div style={{ position: 'absolute', top: 0, left: '2px', width: '16px', height: '14px', background: colors.primary, borderRadius: '0 0 4px 4px', boxShadow: `inset -2px -2px 0 ${colors.secondary}` }}>
            <div style={{ position: 'absolute', left: '-4px', top: '2px', width: '4px', height: '8px', background: colors.primary, borderRadius: '2px 0 0 2px' }} />
            <div style={{ position: 'absolute', right: '-4px', top: '2px', width: '4px', height: '8px', background: colors.primary, borderRadius: '0 2px 2px 0' }} />
          </div>
          <div style={{ position: 'absolute', bottom: '4px', left: '7px', width: '6px', height: '8px', background: colors.secondary }} />
          <div style={{ position: 'absolute', bottom: 0, left: '4px', width: '12px', height: '4px', background: colors.secondary, borderRadius: '1px' }} />
        </div>
      );
    case 'bonsai':
      return (
        <div style={{ position: 'relative', width: '24px', height: '28px' }}>
          <div style={{ position: 'absolute', top: 0, left: '4px', width: '16px', height: '14px', background: colors.primary, borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: '3px', left: '1px', width: '10px', height: '8px', background: `${colors.primary}cc`, borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: '12px', left: '10px', width: '3px', height: '8px', background: '#5a3d2b' }} />
          <div style={{ position: 'absolute', bottom: 0, left: '4px', width: '16px', height: '8px', background: colors.secondary, clipPath: 'polygon(10% 0%, 90% 0%, 80% 100%, 20% 100%)' }} />
        </div>
      );
    case 'cozy-couch':
      return (
        <div style={{ position: 'relative', width: '28px', height: '18px' }}>
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '28px', height: '12px', background: colors.primary, borderRadius: '2px' }} />
          <div style={{ position: 'absolute', bottom: '8px', left: 0, width: '6px', height: '10px', background: colors.secondary, borderRadius: '2px 2px 0 0' }} />
          <div style={{ position: 'absolute', bottom: '8px', right: 0, width: '6px', height: '10px', background: colors.secondary, borderRadius: '2px 2px 0 0' }} />
        </div>
      );
    case 'retro-tv':
      return (
        <div style={{ position: 'relative', width: '24px', height: '22px' }}>
          <div style={{ width: '24px', height: '18px', background: colors.primary, borderRadius: '3px', border: '2px solid #1a1c2c', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: '3px', background: colors.secondary, borderRadius: '1px' }} />
            <div style={{ position: 'absolute', right: '2px', top: '4px', width: '3px', height: '3px', background: '#e76f51', borderRadius: '50%' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '1px' }}>
            <div style={{ width: '3px', height: '3px', background: '#1a1c2c' }} />
            <div style={{ width: '3px', height: '3px', background: '#1a1c2c' }} />
          </div>
        </div>
      );
    case 'kitchen-upgrade':
      return (
        <div style={{ position: 'relative', width: '26px', height: '20px' }}>
          <div style={{ width: '26px', height: '14px', background: colors.primary, borderRadius: '2px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '3px', left: '3px', width: '6px', height: '6px', background: colors.secondary, borderRadius: '50%' }} />
            <div style={{ position: 'absolute', top: '3px', right: '3px', width: '6px', height: '6px', background: colors.secondary, borderRadius: '50%' }} />
          </div>
          <div style={{ width: '26px', height: '5px', background: '#6b4e35', marginTop: '1px' }} />
        </div>
      );
    case 'pet-bed':
      return (
        <div style={{ position: 'relative', width: '26px', height: '14px' }}>
          <div style={{ width: '26px', height: '10px', background: colors.secondary, borderRadius: '4px', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: '2px', background: colors.primary, borderRadius: '3px' }} />
          </div>
        </div>
      );
    case 'balcony-plants':
      return (
        <div style={{ position: 'relative', width: '28px', height: '24px' }}>
          {[0, 10, 20].map((x) => (
            <div key={x} style={{ position: 'absolute', bottom: '6px', left: x + 'px' }}>
              <div style={{ width: '6px', height: '10px', background: x === 10 ? colors.secondary : colors.primary, borderRadius: '3px 3px 0 0' }} />
              <div style={{ width: '6px', height: '5px', background: '#c77b58', clipPath: 'polygon(10% 0%, 90% 0%, 80% 100%, 20% 100%)' }} />
            </div>
          ))}
        </div>
      );
    case 'party-hat':
      return (
        <div style={{ position: 'relative', width: '16px', height: '20px' }}>
          <div style={{ width: '16px', height: '20px', background: colors.primary, clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '16px', height: '4px', background: colors.secondary }} />
          <div style={{ position: 'absolute', top: 0, left: '6px', width: '4px', height: '4px', background: colors.secondary, borderRadius: '50%' }} />
        </div>
      );
    case 'business-suit':
      return (
        <div style={{ position: 'relative', width: '20px', height: '24px' }}>
          <div style={{ width: '20px', height: '24px', background: colors.primary, borderRadius: '2px 2px 0 0', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: '3px', width: '6px', height: '8px', background: '#f5e6c8', borderRadius: '0 0 3px 3px' }} />
            <div style={{ position: 'absolute', top: '8px', left: '8px', width: '4px', height: '16px', background: '#e63946', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
          </div>
        </div>
      );
    case 'cool-shades':
      return (
        <div style={{ position: 'relative', width: '24px', height: '10px' }}>
          <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
            <div style={{ width: '10px', height: '8px', background: colors.primary, borderRadius: '2px' }}>
              <div style={{ width: '10px', height: '4px', background: colors.secondary, borderRadius: '2px 2px 0 0' }} />
            </div>
            <div style={{ width: '2px', height: '2px', background: colors.primary }} />
            <div style={{ width: '10px', height: '8px', background: colors.primary, borderRadius: '2px' }}>
              <div style={{ width: '10px', height: '4px', background: colors.secondary, borderRadius: '2px 2px 0 0' }} />
            </div>
          </div>
        </div>
      );
    case 'gold-watch':
      return (
        <div style={{ position: 'relative', width: '16px', height: '22px' }}>
          <div style={{ position: 'absolute', top: 0, left: '5px', width: '6px', height: '4px', background: colors.secondary }} />
          <div style={{ position: 'absolute', top: '4px', left: '2px', width: '12px', height: '14px', background: colors.primary, borderRadius: '50%', border: `2px solid ${colors.secondary}` }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', width: '2px', height: '4px', background: colors.secondary, transform: 'translate(-50%, -100%)' }} />
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: '5px', width: '6px', height: '4px', background: colors.secondary }} />
        </div>
      );
    case 'power-tie':
      return (
        <div style={{ position: 'relative', width: '12px', height: '24px' }}>
          <div style={{ width: '12px', height: '4px', background: colors.primary, borderRadius: '2px' }} />
          <div style={{ width: '8px', height: '20px', background: colors.primary, margin: '0 auto', clipPath: 'polygon(0% 0%, 100% 0%, 70% 100%, 30% 100%)' }} />
        </div>
      );
    default:
      return <div style={{ width: '16px', height: '16px', background: '#666', borderRadius: '2px' }} />;
  }
}
