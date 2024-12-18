import React from "react";
import { useGetTournamentsById } from "../hooks/queries/useTournaments";
import { useParams } from "react-router-dom";
import { Typography, Paper, Box } from "@mui/material";

const TournamentData = () => {
  const { tournamentId } = useParams();
  const { data, isLoading, error } = useGetTournamentsById(tournamentId);
  if (isLoading) return <p>Загрузка...</p>;
  if (error) return <p>Произошла ошибка: {error.message}</p>;
  return (
    <>
      <Typography variant="h2">{data.name}</Typography>
      {data.description && (
        <Box component={Paper} sx={{ width: "100%" }}>
          <Typography variant="body1" sx={{ m: 2 }}>
            {data.description}
          </Typography>
        </Box>
      )}
    </>
  );
};

export default TournamentData;
