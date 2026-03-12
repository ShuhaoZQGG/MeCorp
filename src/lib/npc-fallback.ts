import type { NpcType, ReputationTier } from '../store/types';

type FallbackDialogues = Record<NpcType, Record<ReputationTier, string[]>>;

const fallbacks: FallbackDialogues = {
  supportive: {
    high: [
      "You're absolutely crushing it! Everyone's noticed.",
      "Keep this up and you'll be running this place!",
    ],
    normal: [
      "Hey, you're doing great! One step at a time.",
      "I believe in you! Let's make today count.",
    ],
    low: [
      "Don't worry, we all have rough patches.",
      "Tomorrow's a new day. You've got this!",
    ],
    critical: [
      "Hey... I'm here for you, okay?",
      "Let's just focus on one small thing today.",
    ],
  },
  concerned: {
    high: [
      "Your metrics look excellent. Very impressive.",
      "I have to say, the data speaks for itself.",
    ],
    normal: [
      "Your numbers are... acceptable. Could be better.",
      "Have you considered optimizing your workflow?",
    ],
    low: [
      "I've been looking at your performance data...",
      "We might need to discuss some improvement strategies.",
    ],
    critical: [
      "This is... concerning. Very concerning.",
      "I really think we need to talk about your trajectory.",
    ],
  },
  competitive: {
    high: [
      "Not bad... but I still completed more tasks last week.",
      "Enjoy the spotlight while it lasts!",
    ],
    normal: [
      "You call that a streak? Watch and learn.",
      "I'm already three levels ahead, just saying.",
    ],
    low: [
      "Ha! I knew I'd pull ahead eventually.",
      "Maybe try actually completing your assignments?",
    ],
    critical: [
      "Wow, even I feel bad for you at this point.",
      "...Do you even want to be here?",
    ],
  },
  manager: {
    high: [
      "Excellent work. This is exactly what we need.",
      "I'm putting you on the fast track for promotion.",
    ],
    normal: [
      "Good effort today. Let's keep that momentum.",
      "Remember, consistent output is key to success here.",
    ],
    low: [
      "We need to have a chat about expectations.",
      "I'd like to see more commitment from you.",
    ],
    critical: [
      "My office. Now.",
      "HR has been asking questions. Just so you know.",
    ],
  },
};

export function getFallbackDialogue(npc: NpcType, tier: ReputationTier): string[] {
  return fallbacks[npc][tier];
}
