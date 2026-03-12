import type { ApartmentTier } from '../../lib/performance';

interface Props {
  tier: ApartmentTier;
}

const allBooks = [
  { color: '#e76f51', width: 9, height: 22 },
  { color: '#6abe30', width: 7, height: 28 },
  { color: '#87ceeb', width: 8, height: 24 },
  { color: '#f7d87c', width: 10, height: 30 },
  { color: '#9b5de5', width: 7, height: 20 },
];

const mutedBooks = [
  { color: '#a06040', width: 9, height: 22 },
  { color: '#4a8040', width: 7, height: 28 },
  { color: '#6090a8', width: 8, height: 24 },
];

const poorBooks = [
  { color: '#7a5038', width: 9, height: 22, rotated: false },
  { color: '#4a6050', width: 7, height: 22, rotated: true },
];

export default function ApartmentBookshelf({ tier }: Props) {
  const isGood = tier === 'good';
  const isPoor = tier === 'poor';

  const books = isGood ? allBooks : isPoor ? poorBooks : mutedBooks;

  return (
    <div
      className="absolute"
      style={{
        right: '200px',
        top: '80px',
        width: '80px',
        imageRendering: 'pixelated',
      }}
    >
      {/* Top shelf plank */}
      <div
        style={{
          height: '5px',
          background: '#5a3d2b',
          borderRadius: '2px 2px 0 0',
          boxShadow: '0 2px 0 rgba(0,0,0,0.2)',
        }}
      />

      {/* Books on shelf */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '2px',
          height: '34px',
          padding: '0 4px',
          background: 'rgba(0,0,0,0.04)',
        }}
      >
        {books.map((book, i) => (
          <div
            key={i}
            style={{
              width: `${book.width}px`,
              height: `${book.height}px`,
              background: book.color,
              borderRadius: '1px',
              boxShadow: 'inset -1px 0 0 rgba(0,0,0,0.25)',
              transform:
                isPoor && (book as typeof poorBooks[0]).rotated
                  ? 'rotate(90deg) translateX(-6px)'
                  : 'none',
              transformOrigin: 'bottom center',
              flexShrink: 0,
            }}
          />
        ))}

        {/* Small framed photo — good tier only */}
        {isGood && (
          <div
            style={{
              width: '12px',
              height: '14px',
              background: '#8b6914',
              border: '2px solid #5a3d2b',
              borderRadius: '1px',
              marginLeft: '2px',
              flexShrink: 0,
              position: 'relative',
            }}
          >
            {/* Photo inside */}
            <div
              style={{
                position: 'absolute',
                inset: '1px',
                background: 'linear-gradient(135deg, #d4a373 0%, #c77b58 100%)',
              }}
            />
          </div>
        )}
      </div>

      {/* Bottom shelf plank */}
      <div
        style={{
          height: '5px',
          background: '#5a3d2b',
          boxShadow: '0 2px 0 rgba(0,0,0,0.2)',
        }}
      />

      {/* Bracket left */}
      <div
        style={{
          position: 'absolute',
          top: '5px',
          left: '-4px',
          width: '4px',
          height: '34px',
          background: '#4a3020',
        }}
      />
      {/* Bracket right */}
      <div
        style={{
          position: 'absolute',
          top: '5px',
          right: '-4px',
          width: '4px',
          height: '34px',
          background: '#4a3020',
        }}
      />
    </div>
  );
}
