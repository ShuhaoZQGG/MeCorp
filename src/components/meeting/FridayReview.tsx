import { useState, useEffect } from 'react';
import { useDailyStore } from '../../store/dailyStore';
import { useGameStore } from '../../store/gameStore';
import StarRating from './StarRating';

export default function FridayReview() {
  const reviewData = useDailyStore((s) => s.fridayReviewData);
  const isFetching = useDailyStore((s) => s.isFetchingReview);
  const dismissReview = useDailyStore((s) => s.dismissFridayReview);
  const setScreen = useGameStore((s) => s.setScreen);

  const [visible, setVisible] = useState(false);
  const [countUp, setCountUp] = useState(0);

  // Entrance delay
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Count-up animation
  useEffect(() => {
    if (!visible || !reviewData) return;
    if (countUp >= 100) return;
    const timer = setInterval(() => {
      setCountUp((prev) => Math.min(prev + 2, 100));
    }, 20);
    return () => clearInterval(timer);
  }, [visible, reviewData, countUp]);

  const [hovered, setHovered] = useState(false);

  if (!visible) return null;

  if (isFetching || !reviewData) {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          background: 'rgba(0,0,0,0.5)',
        }}
      >
        <div
          style={{
            fontSize: '10px',
            fontFamily: "'Press Start 2P', monospace",
            color: '#f7d87c',
            animation: 'blink-cursor 800ms infinite',
          }}
        >
          REVIEWING PERFORMANCE...
        </div>
      </div>
    );
  }

  const pct = countUp / 100;
  const tasksCompleted = Math.round(reviewData.tasksCompleted * pct);
  const tasksAssigned = Math.round(reviewData.tasksAssigned * pct);
  const goldEarned = Math.round(reviewData.goldEarned * pct);
  const xpEarned = Math.round(reviewData.xpEarned * pct);

  const handleDismiss = () => {
    dismissReview();
    setScreen('office');
    window.dispatchEvent(new Event('mecorp-resume-clockin'));
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        background: 'rgba(0,0,0,0.6)',
        animation: 'fade-in 500ms ease-out',
      }}
    >
      <div
        style={{
          width: '460px',
          maxWidth: 'calc(100% - 40px)',
          maxHeight: '80%',
          background: '#1a1c2c',
          border: '4px solid #f7d87c',
          padding: '20px',
          overflowY: 'auto',
          animation: 'slide-up 400ms ease-out',
        }}
      >
        {/* Header */}
        <div
          style={{
            fontSize: '10px',
            fontFamily: "'Press Start 2P', monospace",
            color: '#f7d87c',
            textAlign: 'center',
            marginBottom: '16px',
          }}
        >
          PERFORMANCE REVIEW
        </div>

        {/* Week range */}
        <div
          style={{
            fontSize: '6px',
            fontFamily: "'Press Start 2P', monospace",
            color: '#8b8b8b',
            textAlign: 'center',
            marginBottom: '12px',
          }}
        >
          {reviewData.weekStart} to {reviewData.weekEnd}
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
          {[
            { label: 'TASKS', value: `${tasksCompleted}/${tasksAssigned}` },
            { label: 'GOLD', value: `${goldEarned}G` },
            { label: 'XP', value: `${xpEarned}` },
            { label: 'RATING', value: '' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: '#2a2d4a',
                padding: '8px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '5px',
                  fontFamily: "'Press Start 2P', monospace",
                  color: '#8b8b8b',
                  marginBottom: '4px',
                }}
              >
                {stat.label}
              </div>
              {stat.label === 'RATING' ? (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <StarRating rating={countUp >= 100 ? reviewData.starRating : 0} />
                </div>
              ) : (
                <div
                  style={{
                    fontSize: '10px',
                    fontFamily: "'Press Start 2P', monospace",
                    color: '#f7d87c',
                  }}
                >
                  {stat.value}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Narrative */}
        {reviewData.narrative && (
          <div
            style={{
              background: '#2a2d4a',
              padding: '12px',
              marginBottom: '12px',
              maxHeight: '120px',
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                fontSize: '7px',
                fontFamily: "'Press Start 2P', monospace",
                color: '#e0d8c0',
                lineHeight: 2,
              }}
            >
              {reviewData.narrative}
            </div>
          </div>
        )}

        {/* Focus next week */}
        {reviewData.focusNextWeek && (
          <div
            style={{
              background: 'rgba(247, 216, 124, 0.1)',
              border: '2px solid #f7d87c',
              padding: '8px 12px',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                fontSize: '5px',
                fontFamily: "'Press Start 2P', monospace",
                color: '#f7d87c',
                marginBottom: '4px',
              }}
            >
              FOCUS NEXT WEEK
            </div>
            <div
              style={{
                fontSize: '7px',
                fontFamily: "'Press Start 2P', monospace",
                color: '#e0d8c0',
                lineHeight: 1.8,
              }}
            >
              {reviewData.focusNextWeek}
            </div>
          </div>
        )}

        {/* Dismiss button */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleDismiss}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              background: hovered ? '#2a2d4a' : '#1a1c2c',
              border: '3px solid #f7d87c',
              padding: '8px 24px',
              fontSize: '8px',
              fontFamily: "'Press Start 2P', monospace",
              color: '#f7d87c',
              cursor: 'pointer',
              transition: 'background 150ms',
            }}
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
}
