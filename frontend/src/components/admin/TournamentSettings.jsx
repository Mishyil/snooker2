import React from "react";
import { useParams } from "react-router-dom";
import { useGetTournamentsById } from "../../hooks/queries/useTournaments";
import { CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Container,
  Typography,
  Box,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  useChangeTournamentsBySeriesId,
  useGetTournamentsBySeriesIdDash,
} from "../../hooks/queries/useTournaments";

const TournamentSettings = () => {
  const { tournamentId, seriesId } = useParams();
  const changeTournament = useChangeTournamentsBySeriesId();
  const [previousTournament, setPreviousTournament] = useState(null);
  const {
    data: tournament,
    isLoading,
    error,
  } = useGetTournamentsById(tournamentId);

  const { data: tournaments, isLoading: tournamentsLoading } =
    useGetTournamentsBySeriesIdDash(seriesId);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    place: "",
    visible: false,
  });

  useEffect(() => {
    if (tournament) {
      setFormData({
        ...tournament,
        description: tournament.description || "",
        place: tournament.place || "",
      });
      setPreviousTournament(tournament.previous_tournament || null);
    }
  }, [tournament]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value || "",
    }));
  };

  const handleDateChange = (name, date) => {
    setFormData((prev) => ({
      ...prev,
      [name]: date,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      previous_tournament: previousTournament,
    };
    changeTournament.mutate({ id: tournamentId, data: updatedFormData });
  };

  if (isLoading || tournamentsLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Typography variant="h2" gutterBottom>
        Настройки турнира
      </Typography>
      <Container>
        <form onSubmit={handleSubmit}>
          <TextField
            name="name"
            label="Название турнира"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            name="description"
            label="Описание"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            minRows={4}
            maxRows={6}
            sx={{
              "& .MuiInputBase-root": {
                minHeight: "150px",
              },
            }}
          />
          <TextField
            name="place"
            label="Место проведения"
            value={formData.place}
            onChange={handleChange}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="previous-tournament-label">
              Предыдущий турнир
            </InputLabel>
            <Select
              labelId="previous-tournament-label"
              id="previous-tournament"
              value={previousTournament || ""}
              label="Предыдущий турнир"
              onChange={(e) => setPreviousTournament(e.target.value || null)}
            >
              <MenuItem value={""}>Без турнира</MenuItem>
              {tournaments
                ?.filter(
                  (tournament) => tournament.id !== parseInt(tournamentId)
                )
                .map((tournament) => (
                  <MenuItem key={tournament.id} value={tournament.id}>
                    {tournament.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <Box sx={{ m: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.visible}
                  onChange={handleChange}
                  name="visible"
                />
              }
              label="Видимость турнира"
            />
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            margin="normal"
            sx={{ mb: 1 }}
          >
            Сохранить изменения
          </Button>
        </form>
      </Container>
    </LocalizationProvider>
  );
};

export default TournamentSettings;
