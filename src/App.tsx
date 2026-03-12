import { useEffect } from 'react';
import GameLayout from './components/ui/GameLayout';
import OfficeScene from './components/office/OfficeScene';
import HUD from './components/ui/HUD';
import ClockInButton from './components/ui/ClockInButton';
import RewardAnimation from './components/ui/RewardAnimation';
import GoalScreen from './components/goals/GoalScreen';
import ShopScreen from './components/shop/ShopScreen';
import ShiftHistory from './components/history/ShiftHistory';
import ManagerBriefing from './components/office/ManagerBriefing';
import ProofDialog from './components/office/ProofDialog';
import ClockOutSummary from './components/office/ClockOutSummary';
import ApartmentScene from './components/apartment/ApartmentScene';
import MeetingRoomScene from './components/meeting/MeetingRoomScene';
import FridayReview from './components/meeting/FridayReview';
import LoginScreen from './components/auth/LoginScreen';
import LoadingScreen from './components/auth/LoadingScreen';
import AchievementPopup from './components/ui/AchievementPopup';
import { useGameStore } from './store/gameStore';
import { useAuthStore } from './store/authStore';

export default function App() {
  const currentScreen = useGameStore((s) => s.currentScreen);
  const { user, loading, migrating, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (loading) {
    return (
      <GameLayout>
        <LoadingScreen />
      </GameLayout>
    );
  }

  if (!user) {
    return (
      <GameLayout>
        <LoginScreen />
      </GameLayout>
    );
  }

  if (migrating) {
    return (
      <GameLayout>
        <LoadingScreen message="MIGRATING DATA..." />
      </GameLayout>
    );
  }

  return (
    <GameLayout>
      {currentScreen === 'office' && (
        <>
          <OfficeScene />
          <HUD />
          <ClockInButton />
          <RewardAnimation />
          <ManagerBriefing />
          <ProofDialog />
          <ClockOutSummary />
        </>
      )}
      {currentScreen === 'apartment' && (
        <>
          <ApartmentScene />
          <HUD />
          <ClockInButton />
        </>
      )}
      {currentScreen === 'meeting' && (
        <>
          <MeetingRoomScene />
          <FridayReview />
        </>
      )}
      {currentScreen === 'shop' && <ShopScreen />}
      {currentScreen === 'goals' && <GoalScreen />}
      {currentScreen === 'history' && <ShiftHistory />}
      <AchievementPopup />
    </GameLayout>
  );
}
