import React from "react";
import { useParams } from "react-router-dom";
import { useGetTournamentsBySeriesId } from "../../hooks/queries/useTournaments";
import {
  CircularProgress,
  Box,
  TextField,
  Button,
  ListItemText,
  IconButton,
  Autocomplete,
} from "@mui/material";
import { FixedSizeList } from "react-window";
import AddTournametModel from "./modal/AddTournametModal";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { NavLink } from "react-router-dom";
import { useDeleteTournamentsBySeriesId, useGetTournamentsBySeriesIdDash } from "../../hooks/queries/useTournaments";

const TournamentsSearchList = () => {
  const { seriesId } = useParams();
  const { data, isLoading, error } = useGetTournamentsBySeriesIdDash(seriesId);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const deleteTournamentMutation = useDeleteTournamentsBySeriesId();
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleDelete = async (id) => {
		deleteTournamentMutation.mutate(id)
	};
  const filteredTournaments =
    data?.filter((tournament) =>
      tournament.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <Box
      sx={{
        width: "100%",
        height: 400,
        bgcolor: "background.paper",
        p: 1.5,
        borderRadius: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <Autocomplete
          sx={{ flex: 1, mr: 1 }}
          options={filteredTournaments}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Поиск Турнира"
              variant="outlined"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          )}
          inputValue={searchTerm}
          onInputChange={(event, newInputValue) => {
            setSearchTerm(newInputValue);
          }}
        />
        <Button onClick={handleOpenModal}>Добавить</Button>
      </Box>
      <FixedSizeList
        height={320}
        itemSize={80}
        itemCount={filteredTournaments.length}
        itemData={filteredTournaments}
      >
        {({ index, style, data }) => {
          const tournament = data[index];
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
                borderRadius: 1,
                bgcolor: "background.paper",
                p: 1.5,
                gap: 1,
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                {" "}
                <Button
                  component={NavLink}
                  to={`tournaments/${tournament.id}`}
                  sx={{ textAlign: "left", width: "100%" }}
                >
                  <ListItemText
                    primary={tournament.name}
                    secondary={`Место: ${tournament.place}`}
                  />
                </Button>
              </Box>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(tournament.id);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          );
        }}
      </FixedSizeList>
      <AddTournametModel open={isModalOpen} handleClose={handleCloseModal} />
    </Box>
  );
};

export default TournamentsSearchList;
