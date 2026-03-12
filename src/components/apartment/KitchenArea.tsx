import type { ApartmentTier } from '../../lib/performance';
import { useShopStore } from '../../store/shopStore';

interface Props {
  tier: ApartmentTier;
}

export default function KitchenArea({ tier }: Props) {
  const isGood = tier === 'good';
  const isPoor = tier === 'poor';
  const kitchenUpgradeEquipped = useShopStore((s) => s.getEquippedForSlot('kitchen-upgrade'));

  // Stainless steel colors override when upgrade is equipped
  const counterTopColor = kitchenUpgradeEquipped ? '#c0c0c0' : isPoor ? '#5a4a3a' : '#7a5a3a';
  const counterTopBorder = kitchenUpgradeEquipped ? '#d0d0d0' : isPoor ? '#6a5a4a' : '#8a6a4a';
  const counterFrontColor = kitchenUpgradeEquipped ? '#a0a0a0' : isPoor ? '#4a3828' : '#6b4e35';

  return (
    <div
      className="absolute"
      style={{
        left: '40px',
        bottom: '150px',
        width: '100px',
        height: '80px',
        imageRendering: 'pixelated',
      }}
    >
      {/* Counter top */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50px',
          background: counterTopColor,
          borderRadius: '2px 2px 0 0',
          borderTop: `3px solid ${counterTopBorder}`,
        }}
      />

      {/* Shelf above counter */}
      <div
        style={{
          position: 'absolute',
          top: '6px',
          left: '4px',
          right: '4px',
          height: '6px',
          background: '#5a3d2b',
          borderRadius: '2px',
          boxShadow: '0 2px 0 rgba(0,0,0,0.2)',
        }}
      />

      {/* Counter front panel */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '6px',
          right: '6px',
          height: '44px',
          background: counterFrontColor,
          borderRadius: '0 0 2px 2px',
        }}
      >
        {/* Cabinet lines */}
        <div
          style={{
            position: 'absolute',
            top: '6px',
            left: '6px',
            right: '6px',
            height: '1px',
            background: 'rgba(0,0,0,0.2)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '6px',
            bottom: '6px',
            left: '50%',
            width: '1px',
            background: 'rgba(0,0,0,0.2)',
          }}
        />
      </div>

      {/* Mug — good and neutral */}
      {!isPoor && (
        <div
          style={{
            position: 'absolute',
            bottom: '52px',
            left: '12px',
          }}
        >
          {/* Steam — good only */}
          {isGood && (
            <div style={{ position: 'relative', width: '16px', height: '12px' }}>
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '3px',
                  width: '2px',
                  height: '8px',
                  background: 'rgba(255,255,255,0.6)',
                  borderRadius: '1px',
                  animation: 'steam 1.4s ease-out infinite',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '8px',
                  width: '2px',
                  height: '6px',
                  background: 'rgba(255,255,255,0.5)',
                  borderRadius: '1px',
                  animation: 'steam 1.4s ease-out 0.4s infinite',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '13px',
                  width: '2px',
                  height: '7px',
                  background: 'rgba(255,255,255,0.4)',
                  borderRadius: '1px',
                  animation: 'steam 1.4s ease-out 0.8s infinite',
                }}
              />
            </div>
          )}
          {/* Mug body */}
          <div
            style={{
              width: '16px',
              height: '14px',
              background: isGood ? '#c77b58' : '#8a7060',
              borderRadius: '1px 1px 3px 3px',
              position: 'relative',
            }}
          >
            {/* Mug handle */}
            <div
              style={{
                position: 'absolute',
                right: '-5px',
                top: '3px',
                width: '5px',
                height: '8px',
                border: `2px solid ${isGood ? '#a05838' : '#706050'}`,
                borderLeft: 'none',
                borderRadius: '0 3px 3px 0',
              }}
            />
            {/* Mug liquid */}
            <div
              style={{
                position: 'absolute',
                top: '3px',
                left: '2px',
                right: '2px',
                height: '4px',
                background: isGood ? '#6b3a1f' : '#4a3020',
                borderRadius: '1px',
              }}
            />
          </div>
        </div>
      )}

      {/* Plant — good tier */}
      {isGood && (
        <div
          style={{
            position: 'absolute',
            bottom: '52px',
            right: '10px',
          }}
        >
          {/* Stem */}
          <div
            style={{
              width: '2px',
              height: '14px',
              background: '#4a7a20',
              margin: '0 auto',
            }}
          />
          {/* Leaves circle */}
          <div
            style={{
              width: '16px',
              height: '16px',
              background: '#6abe30',
              borderRadius: '50%',
              marginTop: '-8px',
              boxShadow: 'inset -3px -3px 0 #4a8a20',
            }}
          />
          {/* Small pot */}
          <div
            style={{
              width: '12px',
              height: '8px',
              background: '#c77b58',
              margin: '0 auto',
              clipPath: 'polygon(10% 0%, 90% 0%, 80% 100%, 20% 100%)',
            }}
          />
        </div>
      )}

      {/* Wilted plant — poor tier */}
      {isPoor && (
        <div
          style={{
            position: 'absolute',
            bottom: '52px',
            right: '10px',
          }}
        >
          {/* Drooping stem */}
          <div
            style={{
              width: '2px',
              height: '14px',
              background: '#6a5a30',
              margin: '0 auto',
              transform: 'rotate(20deg)',
              transformOrigin: 'bottom center',
            }}
          />
          {/* Wilted leaves */}
          <div
            style={{
              width: '12px',
              height: '10px',
              background: '#7a6830',
              borderRadius: '50%',
              marginTop: '-6px',
              marginLeft: '4px',
              boxShadow: 'inset -2px -2px 0 #5a4820',
            }}
          />
          {/* Small pot */}
          <div
            style={{
              width: '12px',
              height: '8px',
              background: '#8a6050',
              margin: '0 auto',
              clipPath: 'polygon(10% 0%, 90% 0%, 80% 100%, 20% 100%)',
            }}
          />
        </div>
      )}

      {/* Poor tier: mess items on counter */}
      {isPoor && (
        <>
          <div
            style={{
              position: 'absolute',
              bottom: '52px',
              left: '8px',
              width: '10px',
              height: '6px',
              background: '#6a5040',
              transform: 'rotate(-6deg)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '54px',
              left: '22px',
              width: '6px',
              height: '8px',
              background: '#7a5840',
              transform: 'rotate(10deg)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '52px',
              left: '32px',
              width: '8px',
              height: '4px',
              background: '#5a4838',
              transform: 'rotate(-3deg)',
            }}
          />
        </>
      )}
    </div>
  );
}
