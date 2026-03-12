import { useState, useEffect, useCallback } from 'react';

interface Props {
  speakerName: string;
  lines: string[];
  onComplete: () => void;
  speakerColor?: string;
}

export default function DialogueBox({ speakerName, lines, onComplete, speakerColor = '#f7d87c' }: Props) {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [lineComplete, setLineComplete] = useState(false);

  const currentLine = lines[lineIndex] ?? '';

  useEffect(() => {
    if (charIndex >= currentLine.length) {
      setLineComplete(true);
      return;
    }
    const timer = setInterval(() => {
      setCharIndex((prev) => {
        if (prev >= currentLine.length) {
          setLineComplete(true);
          return prev;
        }
        return prev + 1;
      });
    }, 30);
    return () => clearInterval(timer);
  }, [charIndex, currentLine]);

  const handleAdvance = useCallback(() => {
    if (!lineComplete) {
      // Skip to end of current line
      setCharIndex(currentLine.length);
      setLineComplete(true);
      return;
    }
    if (lineIndex < lines.length - 1) {
      setLineIndex((prev) => prev + 1);
      setCharIndex(0);
      setLineComplete(false);
    } else {
      onComplete();
    }
  }, [lineComplete, lineIndex, lines.length, currentLine.length, onComplete]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleAdvance();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleAdvance]);

  return (
    <div
      onClick={handleAdvance}
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '500px',
        maxWidth: 'calc(100% - 40px)',
        background: '#1a1c2c',
        border: '4px solid #f7d87c',
        padding: '16px 20px 20px',
        zIndex: 55,
        cursor: 'pointer',
        animation: 'slide-up 300ms ease-out',
        imageRendering: 'pixelated' as const,
      }}
    >
      {/* Speaker name */}
      <div
        style={{
          position: 'absolute',
          top: '-12px',
          left: '12px',
          background: '#1a1c2c',
          padding: '2px 8px',
          fontSize: '7px',
          fontFamily: "'Press Start 2P', monospace",
          color: speakerColor,
          lineHeight: 1,
        }}
      >
        {speakerName}
      </div>

      {/* Text */}
      <div
        style={{
          fontSize: '8px',
          fontFamily: "'Press Start 2P', monospace",
          color: '#e0d8c0',
          lineHeight: 1.8,
          minHeight: '32px',
        }}
      >
        {currentLine.slice(0, charIndex)}
      </div>

      {/* Blinking triangle indicator */}
      {lineComplete && (
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '12px',
            width: 0,
            height: 0,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: '6px solid #f7d87c',
            animation: 'blink-cursor 800ms infinite',
          }}
        />
      )}
    </div>
  );
}
