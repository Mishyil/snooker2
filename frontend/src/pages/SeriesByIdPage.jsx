import React from "react";
import SeriesById from "../components/admin/SeriesById";
import SeriesSettings from "../components/admin/SeriesSettings";
import TournamentsSearchList from "../components/admin/TournamentsSearchList";
import PlayersSearchList from "../components/admin/PlayersSearchList";

const SeriesByIdPage = () => {
  return (
    <>
      <SeriesSettings />
      <TournamentsSearchList />
      <PlayersSearchList />
    </>
  );
};

export default SeriesByIdPage;
