import { useEffect, useState } from 'react';
import { useNpcStore } from '../../store/npcStore';
import { useGameStore } from '../../store/gameStore';
import { useDailyStore } from '../../store/dailyStore';
import { getReputationTier } from '../../lib/reputation';
import { getFallbackDialogue } from '../../lib/npc-fallback';
import { fetchNpcDialogue } from '../../lib/api';
import DialogueBox from '../ui/DialogueBox';
import type { NpcType } from '../../store/types';

const NPC_NAMES: Record<NpcType, string> = {
  supportive: 'SUNNY',
  concerned: 'BLAIR',
  competitive: 'SPIKE',
  manager: 'THE BOSS',
};

const NPC_COLORS: Record<NpcType, string> = {
  supportive: '#38b764',
  concerned: '#4a7ab5',
  competitive: '#e67e22',
  manager: '#9b59b6',
};

export default function NpcDialogueManager() {
  const activeNpc = useNpcStore((s) => s.activeNpc);
  const dialogueCache = useNpcStore((s) => s.dialogueCache);
  const closeDialogue = useNpcStore((s) => s.closeNpcDialogue);
  const setCache = useNpcStore((s) => s.setDialogueCache);
  const isFetching = useNpcStore((s) => s.isFetchingDialogue);

  const reputation = useGameStore((s) => s.reputation);
  const streak = useGameStore((s) => s.streak);
  const level = useGameStore((s) => s.level);
  const shiftHistory = useDailyStore((s) => s.shiftHistory);

  const [fetchError, setFetchError] = useState(false);

  const today = new Date().toLocaleDateString('en-CA');
  const cacheValid = dialogueCache !== null && dialogueCache.date === today;

  useEffect(() => {
    if (!activeNpc || cacheValid || isFetching) return;

    useNpcStore.setState({ isFetchingDialogue: true });
    setFetchError(false);

    const totalShifts = shiftHistory.length;
    const totalCompleted = shiftHistory.reduce((s, r) => s + r.tasksCompleted, 0);
    const totalAssigned = shiftHistory.reduce((s, r) => s + r.tasksAssigned, 0);
    const completionRate = totalAssigned > 0 ? Math.round((totalCompleted / totalAssigned) * 100) : 0;

    fetchNpcDialogue({
      reputation,
      streak,
      level,
      completionRate,
      daysActive: totalShifts,
    })
      .then((data) => {
        setCache({ date: today, dialogues: data });
        useNpcStore.setState({ isFetchingDialogue: false });
      })
      .catch(() => {
        setFetchError(true);
        useNpcStore.setState({ isFetchingDialogue: false });
      });
  }, [activeNpc, cacheValid, isFetching, reputation, streak, level, shiftHistory, setCache, today]);

  if (!activeNpc) return null;

  // Show loading indicator while fetching
  if (isFetching && !cacheValid) {
    return (
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '8px',
          fontFamily: "'Press Start 2P', monospace",
          color: '#f7d87c',
          zIndex: 55,
          animation: 'blink-cursor 800ms infinite',
        }}
      >
        ...
      </div>
    );
  }

  // Get lines from cache or fallback
  let lines: string[];
  if (cacheValid && dialogueCache.dialogues[activeNpc]) {
    lines = dialogueCache.dialogues[activeNpc] as string[];
  } else {
    const tier = getReputationTier(reputation);
    lines = getFallbackDialogue(activeNpc, tier);
  }

  // Suppress unused variable warning — fetchError is used for future error UI
  void fetchError;

  return (
    <DialogueBox
      speakerName={NPC_NAMES[activeNpc]}
      lines={lines}
      speakerColor={NPC_COLORS[activeNpc]}
      onComplete={closeDialogue}
    />
  );
}
