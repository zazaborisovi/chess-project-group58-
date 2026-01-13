import { useLeaderBoard } from "@/contexts/leaderboard.context";

const LeaderboardPage = () => {
  const {leaderboard} = useLeaderBoard();

  return (
    <div>
      <h1>Leaderboard</h1>
      {
        leaderboard.map(player => (
          <div className="flex justify-between">
            <span>{player.username}</span>
            <span>{player.wins}</span>
          </div>
        ))
      }
    </div>
  );
};

export default LeaderboardPage;
