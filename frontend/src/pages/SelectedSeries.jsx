import React from "react";
import TournamentsBySeriesId from "../components/TournamentsBySeriesId";
import PlayersBySeries from "../components/PlayersBySeries";

const SelectedSeries = () => {
  return (
    <>
      <TournamentsBySeriesId />
      <PlayersBySeries />
    </>
  );
};

export default SelectedSeries;
