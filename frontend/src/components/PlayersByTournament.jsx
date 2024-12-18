import React from "react";
import { useGetPlayersByTournamentId } from "../hooks/queries/useTournaments";
import { useParams } from "react-router-dom";
import {
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Paper,
  TableCell,
} from "@mui/material";

const PlayersByTournament = () => {
  const { tournamentId } = useParams();
  const { data, isLoading, error } = useGetPlayersByTournamentId(tournamentId);
  if (isLoading) return <p>Загрузка...</p>;
  if (error) return <p>Произошла ошибка: {error.message}</p>;
  if (!data || data.length === 0) return <></>;
  return (
    <>
      <Typography variant="h3">Список игроков </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 350 }} aria-label="custom table">
          <TableHead>
            <TableRow>
              <TableCell>№</TableCell>
              <TableCell>ФИО</TableCell>
              <TableCell align="right">Рейтинг</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.sort((a, b) => b.rating - a.rating).map((player, index) => (
              <TableRow key={player.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{`${player.last_name} ${player.first_name} `}</TableCell>
                <TableCell align="right">{player.rating}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default PlayersByTournament;
