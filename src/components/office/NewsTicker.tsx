import { useEffect, useState } from 'react';
import { useNewsStore } from '../../store/newsStore';

export default function NewsTicker() {
  const newsCache = useNewsStore((s) => s.newsCache);
  const fetchNewsIfStale = useNewsStore((s) => s.fetchNewsIfStale);
  const [showArchive, setShowArchive] = useState(false);
  const pixelFont = "'Press Start 2P', monospace";

  useEffect(() => {
    fetchNewsIfStale();
  }, [fetchNewsIfStale]);

  const items = newsCache?.items ?? [];
  const tickerText = items.map((n) => n.headline).join('  ///  ');

  return (
    <>
      {/* Wall-mounted TV */}
      <div
        onClick={() => setShowArchive(true)}
        style={{
          position: 'absolute',
          left: '180px',
          top: '60px',
          width: '100px',
          height: '48px',
          background: '#2a2d4a',
          border: '3px solid #1a1c2c',
          borderRadius: '2px',
          cursor: 'pointer',
          overflow: 'hidden',
          zIndex: 8,
          transition: 'filter 200ms ease',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1.2)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1)'; }}
      >
        {/* Screen */}
        <div
          style={{
            position: 'absolute',
            inset: '3px',
            background: '#0a1520',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* NEWS label */}
          <div style={{
            fontSize: '4px',
            fontFamily: pixelFont,
            color: '#e76f51',
            padding: '2px 3px',
            background: 'rgba(231, 111, 81, 0.1)',
          }}>
            MECORP NEWS
          </div>
          {/* Scrolling ticker */}
          <div style={{
            flex: 1,
            overflow: 'hidden',
            position: 'relative',
          }}>
            {tickerText && (
              <div style={{
                position: 'absolute',
                top: '4px',
                whiteSpace: 'nowrap',
                fontSize: '4px',
                fontFamily: pixelFont,
                color: '#f7d87c',
                animation: `scroll-ticker ${Math.max(tickerText.length * 0.15, 8)}s linear infinite`,
              }}>
                {tickerText}
              </div>
            )}
          </div>
        </div>
        {/* TV stand nub */}
        <div style={{
          position: 'absolute',
          bottom: '-4px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '12px',
          height: '4px',
          background: '#1a1c2c',
        }} />
      </div>

      {showArchive && (
        <NewsArchiveModal onClose={() => setShowArchive(false)} />
      )}
    </>
  );
}

function NewsArchiveModal({ onClose }: { onClose: () => void }) {
  const newsHistory = useNewsStore((s) => s.newsHistory);
  const pixelFont = "'Press Start 2P', monospace";

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 55,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#1a1c2c',
          border: '3px solid #f7d87c',
          padding: '12px',
          width: '300px',
          maxHeight: '70%',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '7px', fontFamily: pixelFont, color: '#f7d87c' }}>NEWS ARCHIVE</span>
          <span onClick={onClose} style={{ fontSize: '7px', fontFamily: pixelFont, color: '#e76f51', cursor: 'pointer' }}>X</span>
        </div>
        {newsHistory.length === 0 && (
          <div style={{ fontSize: '5px', fontFamily: pixelFont, color: '#888' }}>No news yet...</div>
        )}
        {newsHistory.map((item) => (
          <div key={item.id} style={{ borderBottom: '1px solid #2a2d4a', paddingBottom: '6px' }}>
            <div style={{ fontSize: '5px', fontFamily: pixelFont, color: '#f5e6c8' }}>{item.headline}</div>
            <div style={{ fontSize: '4px', fontFamily: pixelFont, color: '#888', marginTop: '2px', lineHeight: '8px' }}>{item.body}</div>
            <div style={{ fontSize: '3px', fontFamily: pixelFont, color: '#555', marginTop: '2px' }}>{item.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
