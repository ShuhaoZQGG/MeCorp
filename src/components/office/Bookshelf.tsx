import { useShopStore } from '../../store/shopStore';

const books = [
  { color: '#e63946', width: 8, height: 28 },
  { color: '#457b9d', width: 10, height: 32 },
  { color: '#f7d87c', width: 7, height: 26 },
  { color: '#2a9d8f', width: 9, height: 30 },
  { color: '#e76f51', width: 8, height: 28 },
  { color: '#6abe30', width: 7, height: 24 },
  { color: '#9b5de5', width: 10, height: 31 },
  { color: '#f0f0f0', width: 8, height: 27 },
];

export default function Bookshelf() {
  const trophyEquipped = useShopStore((s) => s.getEquippedForSlot('bookshelf-item'));

  return (
    <div
      className="absolute"
      style={{
        top: '100px',
        left: '60px',
        width: '120px',
      }}
    >
      {/* Shelf frame */}
      <div
        style={{
          background: '#5a3d2b',
          padding: '4px',
          borderRadius: '2px',
        }}
      >
        {/* Top shelf */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '2px',
            height: '36px',
            padding: '0 4px',
          }}
        >
          {trophyEquipped && (
            <div style={{ position: 'relative', width: '14px', height: '20px', flexShrink: 0 }}>
              {/* Trophy cup */}
              <div style={{ position: 'absolute', top: 0, left: '1px', width: '12px', height: '10px', background: '#ffd700', borderRadius: '0 0 3px 3px', boxShadow: 'inset -1px -1px 0 #a07818' }}>
                <div style={{ position: 'absolute', left: '-3px', top: '1px', width: '3px', height: '6px', background: '#ffd700', borderRadius: '2px 0 0 2px' }} />
                <div style={{ position: 'absolute', right: '-3px', top: '1px', width: '3px', height: '6px', background: '#ffd700', borderRadius: '0 2px 2px 0' }} />
              </div>
              {/* Trophy stem */}
              <div style={{ position: 'absolute', bottom: '3px', left: '6px', width: '3px', height: '6px', background: '#a07818' }} />
              {/* Trophy base */}
              <div style={{ position: 'absolute', bottom: 0, left: '2px', width: '10px', height: '3px', background: '#a07818', borderRadius: '1px' }} />
            </div>
          )}
          {books.slice(0, 4).map((book, i) => (
            <div
              key={i}
              style={{
                width: book.width + 'px',
                height: book.height + 'px',
                background: book.color,
                borderRadius: '1px',
                boxShadow: 'inset -1px 0 0 rgba(0,0,0,0.2)',
              }}
            />
          ))}
        </div>
        {/* Shelf plank */}
        <div
          style={{
            height: '4px',
            background: '#6b4e12',
            margin: '2px 0',
            borderTop: '1px solid #8b6914',
          }}
        />
        {/* Bottom shelf */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '2px',
            height: '36px',
            padding: '0 4px',
          }}
        >
          {books.slice(4).map((book, i) => (
            <div
              key={i}
              style={{
                width: book.width + 'px',
                height: book.height + 'px',
                background: book.color,
                borderRadius: '1px',
                boxShadow: 'inset -1px 0 0 rgba(0,0,0,0.2)',
              }}
            />
          ))}
        </div>
        {/* Bottom plank */}
        <div
          style={{
            height: '4px',
            background: '#6b4e12',
            marginTop: '2px',
            borderTop: '1px solid #8b6914',
          }}
        />
      </div>
    </div>
  );
}
