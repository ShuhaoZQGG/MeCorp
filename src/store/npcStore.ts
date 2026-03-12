import { create } from 'zustand';
import type { NpcType } from './types';

interface DialogueCache {
  date: string;
  dialogues: Partial<Record<NpcType, string[]>>;
}

interface NpcState {
  activeNpc: NpcType | null;
  dialogueCache: DialogueCache | null;
  isFetchingDialogue: boolean;

  openNpcDialogue: (npc: NpcType) => void;
  closeNpcDialogue: () => void;
  setDialogueCache: (cache: DialogueCache) => void;
}

export const useNpcStore = create<NpcState>()((set) => ({
  activeNpc: null,
  dialogueCache: null,
  isFetchingDialogue: false,

  openNpcDialogue: (npc) => set({ activeNpc: npc }),
  closeNpcDialogue: () => set({ activeNpc: null }),
  setDialogueCache: (cache) => set({ dialogueCache: cache }),
}));
