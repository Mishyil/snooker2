import React from "react";
import { useGetTournamentsBySeriesId } from "../hooks/queries/useTournaments";
import { useParams, NavLink as RouterLink } from "react-router-dom";
import {
  TableHead,
  TableContainer,
  TableRow,
  TableBody,
  TableCell,
  Button,
  Table,
  Paper,
  Typography,
  Box,
} from "@mui/material";

const TournamentsBySeriesId = () => {
  const { seriesId } = useParams();
  const { data = [], isLoading, error } = useGetTournamentsBySeriesId(seriesId);
  if (isLoading) return <p>Загрузка...</p>;
  if (error) return <p>Произошла ошибка: {error.message}</p>;
  return (
    <>
      <Typography variant="h4">Список турниров</Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 340 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Название</TableCell>
              <TableCell>Место проведения</TableCell>
              <TableCell>Начало</TableCell>
              <TableCell>Конец</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((tournament) => (
              <TableRow
                key={tournament.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Button
                    variant="text"
                    color="info"
                    size="small"
                    component={RouterLink}
                    to={`tournaments/${tournament.id}`}
                  >
                    {tournament.name}
                  </Button>
                </TableCell>
                <TableCell component="th" scope="row">
                  {tournament.place}
                </TableCell>
                <TableCell component="th" scope="row">
                  {tournament.start_date}
                </TableCell>
                <TableCell component="th" scope="row">
                  {tournament.end_date}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Рейтинг игроков серии
      </Typography>
    </>
  );
};

export default TournamentsBySeriesId;
