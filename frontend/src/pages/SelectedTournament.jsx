import TournamentData from "../components/TournamentData";
import PlayersByTournament from "../components/PlayersByTournament";
import Qualifiers from "../components/Qualifiers";
import Playoff from "../components/Playoff";

const SelectedTournament = () => {
  return (
    <>
      <TournamentData />
      <PlayersByTournament />
      <Qualifiers />
      <Playoff />
    </>
  );
};

export default SelectedTournament;
