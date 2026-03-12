import { type ReactNode } from 'react';

const GAME_WIDTH = 960;
const GAME_HEIGHT = 540;
const ASPECT_RATIO = GAME_WIDTH / GAME_HEIGHT;

export default function GameLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <div
        className="relative overflow-hidden"
        style={{
          width: '100%',
          maxWidth: `min(100vw, ${ASPECT_RATIO * 100}vh)`,
          aspectRatio: `${GAME_WIDTH} / ${GAME_HEIGHT}`,
          imageRendering: 'pixelated',
        }}
      >
        {children}
      </div>
    </div>
  );
}
