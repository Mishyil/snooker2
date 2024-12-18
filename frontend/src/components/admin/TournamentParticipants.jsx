import { useGetPlayersByTournamentId } from "../../hooks/queries/useTournaments";
import { usePlayersBySeries } from "../../hooks/queries/usePlayers";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMutation } from "@tanstack/react-query";
import {
  useDeletePlayerByTournamentId,
  useAddPlayerByTournamentId,
} from "../../hooks/queries/useTournaments";

const TournamentParticipants = () => {
  const { tournamentId, seriesId } = useParams();
  const {
    data: playersByTournament,
    isLoading: isLoadingTournament,
    error: errorTournament,
  } = useGetPlayersByTournamentId(tournamentId);
  const {
    data: playersBySeries,
    isLoading: isLoadingSeries,
    error: errorSeries,
  } = usePlayersBySeries(seriesId);

  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [formData, setFormData] = useState({
    players: [],
  });

  useEffect(() => {
    if (playersBySeries && playersByTournament) {
      const filteredPlayers = playersBySeries.filter(
        (player) => !playersByTournament.some((pt) => pt.id === player.id)
      );
      setFormData({ players: filteredPlayers });
    }
  }, [playersBySeries, playersByTournament]);

  const addPlayerMutation = useAddPlayerByTournamentId();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedPlayers.length > 0) {
      const formDataToSend = {
        player_ids: [
          ...playersByTournament.map((player) => player.id),
          ...selectedPlayers.map((player) => player.id),
        ],
      };
      addPlayerMutation.mutate({ id: tournamentId, data: formDataToSend });
      setSelectedPlayers([]);
    }
  };

  const deletePlayerMutation = useDeletePlayerByTournamentId();

  const handleRemovePlayer = (playerId) => {
    deletePlayerMutation.mutate({ id: tournamentId, playerId: playerId });
  };

  if (isLoadingTournament || isLoadingSeries) {
    return <CircularProgress />;
  }

  if (errorTournament || errorSeries) {
    const errorMessage = errorTournament
      ? errorTournament.message
      : errorSeries.message;
    return <div>Error: {errorMessage}</div>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Участники турнира
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>№</TableCell>
              <TableCell>Фамилия и Имя</TableCell>
              <TableCell>Рейтинг</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {playersByTournament
              .sort((a, b) => b.rating - a.rating)
              .map((player, index) => (
                <TableRow key={player.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{`${player.last_name} ${player.first_name}`}</TableCell>
                  <TableCell>{player.rating}</TableCell>
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
      </TableContainer>

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
              label="Выберите игроков, которых хотите добавить"
              placeholder="ФИО игрока"
            />
          )}
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Добавить к турниру
        </Button>
      </Stack>
    </Container>
  );
};
export default TournamentParticipants;
