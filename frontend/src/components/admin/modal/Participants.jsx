import { useGetPlayersByTournamentId } from "../../../hooks/queries/useTournaments";
import { usePlayersBySeries } from "../../../hooks/queries/usePlayers";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Autocomplete,
  TextField,
  Stack,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMutation } from "@tanstack/react-query";
import {
  useDeletePlayerByTournamentId,
  useAddPlayerByTournamentId,
} from "../../../hooks/queries/useTournaments";
import { usePlayersByStage } from "../../../hooks/queries/usePlayers";
import {
  useAddPlayersToStage,
  useDeletePlayersToStage,
} from "../../../hooks/queries/usePlayOff";

const Participants = () => {
  const { tournamentId, seriesId } = useParams();
  const {
    data: playersByTournament,
    isLoading: isLoadingTournament,
    error: errorTournament,
  } = useGetPlayersByTournamentId(tournamentId);
  const {
    data: playersByStage,
    isLoading: isLoadingStage,
    error: errorStage,
  } = usePlayersByStage(tournamentId);

  const addPlayersMutation = useAddPlayersToStage();
  const deletePlayersMutation = useDeletePlayersToStage();
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [formData, setFormData] = useState({
    players: [],
  });

  useEffect(() => {
    if (playersByStage && playersByTournament) {
      const filteredPlayers = playersByTournament.filter(
        (player) => !playersByStage.some((pt) => pt.id === player.id)
      );
      setFormData({ players: filteredPlayers });
    }
  }, [playersByStage, playersByTournament]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedPlayers.length > 0) {
      const formDataToSend = {
        player_ids: [
          ...playersByStage.map((player) => player.id),
          ...selectedPlayers.map((player) => player.id),
        ],
      };
      addPlayersMutation.mutate({ id: tournamentId, data: formDataToSend });
      setSelectedPlayers([]);
    }
  };

  const handleRemovePlayer = (playerId) => {
    deletePlayersMutation.mutate({
      id: tournamentId,
      playerId: playerId,
    });
  };

  if (isLoadingTournament || isLoadingStage) {
    return <CircularProgress />;
  }

  if (errorTournament || errorStage) {
    const errorMessage = errorTournament
      ? errorTournament.message
      : errorSeries.message;
    return <div>Error: {errorMessage}</div>;
  }

  return (
    <Box sx={{ p: 1 }}>
      <Box component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>№</TableCell>
              <TableCell>Фамилия и Имя</TableCell>
              <TableCell>Рейтинг</TableCell>
              <TableCell>Общий</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {playersByStage
              .sort((a, b) => b.total_points - a.total_points)
              .map((player, index) => (
                <TableRow key={player.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{`${player.last_name} ${player.first_name}`}</TableCell>
                  <TableCell>{player.rating} (+{player.previous_tournament_break_points})</TableCell>
                  <TableCell>{player.total_points}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="error"
                      onClick={() => handleRemovePlayer(player.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Box>

      <Stack direction="row" alignItems="center" spacing={2} mt={2}>
        <Autocomplete
          sx={{ flex: 1 }}
          multiple
          id="tags-outlined"
          options={formData.players || []}
          getOptionLabel={(option) =>
            `${option.first_name} ${option.last_name}`
          }
          value={selectedPlayers}
          filterSelectedOptions
          onChange={(event, value) => setSelectedPlayers(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Выберите игроков из текущего турнира"
              placeholder="ФИО игрока"
            />
          )}
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Добавить игроков к сетке
        </Button>
      </Stack>
    </Box>
  );
};
export default Participants;
