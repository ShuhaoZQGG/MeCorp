import type { ApartmentTier } from '../../lib/performance';
import { useShopStore } from '../../store/shopStore';

interface Props {
  tier: ApartmentTier;
}

export default function CatCompanion({ tier }: Props) {
  const isGood = tier === 'good';
  const isPoor = tier === 'poor';
  const petBedEquipped = useShopStore((s) => s.getEquippedForSlot('pet-bed'));

  const bodyColor = '#e76f51';
  const earColor = '#c85030';
  const eyeColor = '#2a1a0a';

  // Poor: cat is hiding under bed — only ears poke out
  if (isPoor) {
    return (
      <div
        className="absolute"
        style={{
          right: '80px',
          bottom: '145px',
          imageRendering: 'pixelated',
        }}
      >
        {/* Left ear */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '5px',
            height: '5px',
            background: bodyColor,
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          }}
        />
        {/* Right ear */}
        <div
          style={{
            position: 'absolute',
            left: '8px',
            bottom: 0,
            width: '5px',
            height: '5px',
            background: bodyColor,
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="absolute"
      style={{
        bottom: '180px',
        left: '55%',
        imageRendering: 'pixelated',
      }}
    >
      {/* Pet bed — shown under cat when equipped and not in poor tier */}
      {petBedEquipped && (
        <div
          style={{
            position: 'absolute',
            bottom: '-6px',
            left: '-8px',
            width: '32px',
            height: '10px',
            background: '#c77b58',
            borderRadius: '4px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: '2px',
              background: '#e76f51',
              borderRadius: '3px',
            }}
          />
        </div>
      )}
      {/* Tail */}
      <div
        style={{
          position: 'absolute',
          bottom: '2px',
          right: '-8px',
          width: '10px',
          height: '3px',
          background: earColor,
          borderRadius: '0 2px 2px 0',
          transformOrigin: 'left center',
          animation: isGood ? 'tail-sway 1.2s ease-in-out infinite' : 'none',
        }}
      />

      {/* Body */}
      <div
        style={{
          width: '16px',
          height: '12px',
          background: bodyColor,
          borderRadius: '3px 3px 2px 2px',
          position: 'relative',
        }}
      >
        {/* Belly patch */}
        <div
          style={{
            position: 'absolute',
            bottom: '1px',
            left: '3px',
            right: '3px',
            height: '5px',
            background: '#f0a07a',
            borderRadius: '2px',
          }}
        />
      </div>

      {/* Head */}
      <div
        style={{
          position: 'absolute',
          top: '-10px',
          left: '1px',
          width: '14px',
          height: '12px',
          background: bodyColor,
          borderRadius: '3px',
        }}
      >
        {/* Left ear */}
        <div
          style={{
            position: 'absolute',
            top: '-4px',
            left: '1px',
            width: '4px',
            height: '5px',
            background: bodyColor,
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          }}
        />
        {/* Right ear */}
        <div
          style={{
            position: 'absolute',
            top: '-4px',
            right: '1px',
            width: '4px',
            height: '5px',
            background: bodyColor,
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          }}
        />
        {/* Inner ears */}
        <div
          style={{
            position: 'absolute',
            top: '-2px',
            left: '2px',
            width: '2px',
            height: '3px',
            background: earColor,
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '-2px',
            right: '2px',
            width: '2px',
            height: '3px',
            background: earColor,
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          }}
        />
        {/* Eyes */}
        <div
          style={{
            position: 'absolute',
            top: '3px',
            left: '2px',
            width: '3px',
            height: '3px',
            background: eyeColor,
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '3px',
            right: '2px',
            width: '3px',
            height: '3px',
            background: eyeColor,
            borderRadius: '50%',
          }}
        />
        {/* Nose */}
        <div
          style={{
            position: 'absolute',
            bottom: '2px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '2px',
            height: '2px',
            background: '#c85050',
            borderRadius: '50%',
          }}
        />
      </div>
    </div>
  );
}
