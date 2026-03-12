import MeetingWall from './MeetingWall';
import MeetingFloor from './MeetingFloor';
import ConferenceTable from './ConferenceTable';
import Whiteboard from './Whiteboard';
import MeetingChair from './MeetingChair';
import BossCharacter from './BossCharacter';

export default function MeetingRoomScene() {
  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ imageRendering: 'pixelated' }}
    >
      <MeetingWall />
      <Whiteboard />
      <BossCharacter />
      <ConferenceTable />
      <MeetingChair side="left" />
      <MeetingChair side="right" />
      <MeetingFloor />
    </div>
  );
}
