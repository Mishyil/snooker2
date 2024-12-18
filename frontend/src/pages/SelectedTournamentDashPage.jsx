import React from "react";
import TournamentSettings from "../components/admin/TournamentSettings";
import TournamentParticipants from "../components/admin/TournamentParticipants";
import TournamentGroups from "../components/admin/TournamentGroups";
import TournamentGroupsMatches from "../components/admin/TournamentGroupsMatches";
import TournamentPlayoff from "../components/admin/TournamentPlayoff";

const SelectedTournamentDashPage = () => {
  return (
    <>
      <TournamentSettings />
      <TournamentParticipants />
      <TournamentGroups />
      <TournamentGroupsMatches />
      <TournamentPlayoff />
    </>
  );
};

export default SelectedTournamentDashPage;
