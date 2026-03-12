import spriteSheet from '../../assets/sprites/character-idle.png';
import { useGameStore } from '../../store/gameStore';
import { useShopStore } from '../../store/shopStore';

export default function Character() {
  const shiftActive = useGameStore((s) => s.shiftActive);
  const hatEquipped = useShopStore((s) => s.getEquippedForSlot('hat'));
  const shirtEquipped = useShopStore((s) => s.getEquippedForSlot('shirt'));
  const accessoryEquipped = useShopStore((s) => s.getEquippedForSlot('accessory'));

  return (
    <div
      className="absolute"
      style={{
        bottom: '76px',
        left: '50%',
        transform: `translateX(-20px) translateY(${shiftActive ? '-2px' : '0px'})`,
        width: '32px',
        height: '32px',
        imageRendering: 'pixelated',
        transition: 'transform 300ms ease',
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          backgroundImage: `url(${spriteSheet})`,
          backgroundSize: '64px 32px',
          animation: 'idle 1s steps(2) infinite',
          transform: 'scale(2)',
          transformOrigin: 'bottom center',
        }}
      />
      {/* Hat overlay */}
      {hatEquipped?.itemId === 'party-hat' && (
        <div
          style={{
            position: 'absolute',
            top: '-12px',
            left: '50%',
            transform: 'translateX(-50%) scale(2)',
            transformOrigin: 'bottom center',
            width: '8px',
            height: '10px',
            background: '#e63946',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            pointerEvents: 'none',
          }}
        />
      )}
      {/* Shirt overlay — business suit collar */}
      {shirtEquipped?.itemId === 'business-suit' && (
        <div
          style={{
            position: 'absolute',
            bottom: '4px',
            left: '50%',
            transform: 'translateX(-50%) scale(2)',
            transformOrigin: 'bottom center',
            width: '10px',
            height: '6px',
            background: '#2a2d4a',
            pointerEvents: 'none',
          }}
        />
      )}
      {/* Shirt overlay — power tie */}
      {shirtEquipped?.itemId === 'power-tie' && (
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            left: '50%',
            transform: 'translateX(-50%) scale(2)',
            transformOrigin: 'bottom center',
            width: '4px',
            height: '8px',
            background: '#e63946',
            clipPath: 'polygon(50% 0%, 0% 30%, 20% 100%, 80% 100%, 100% 30%)',
            pointerEvents: 'none',
          }}
        />
      )}
      {/* Accessory overlay — cool shades */}
      {accessoryEquipped?.itemId === 'cool-shades' && (
        <div
          style={{
            position: 'absolute',
            top: '4px',
            left: '50%',
            transform: 'translateX(-50%) scale(2)',
            transformOrigin: 'top center',
            display: 'flex',
            gap: '1px',
            pointerEvents: 'none',
          }}
        >
          <div style={{ width: '5px', height: '3px', background: '#1a1c2c', borderRadius: '1px' }} />
          <div style={{ width: '5px', height: '3px', background: '#1a1c2c', borderRadius: '1px' }} />
        </div>
      )}
      {/* Accessory overlay — gold watch */}
      {accessoryEquipped?.itemId === 'gold-watch' && (
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '4px',
            transform: 'scale(2)',
            transformOrigin: 'bottom left',
            width: '4px',
            height: '4px',
            background: '#ffd700',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}
