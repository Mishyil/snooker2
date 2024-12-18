import React, { useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import {
  usePlayersBySeries,
  useDeletePlayer,
} from "../../hooks/queries/usePlayers";
import {
  Button,
  ListItemText,
  IconButton,
  CircularProgress,
  ListItemAvatar,
  ListItemButton,
  TextField,
  Autocomplete,
  Avatar,
  Box,
  ListItem,
} from "@mui/material";
import { FixedSizeList } from "react-window";
import AddPlayerModal from "./modal/AddPlayerModal";
import DeleteIcon from "@mui/icons-material/Delete";
import EditPlayerProfileModal from "./modal/EditPlayerProfileModal";

const PlayersSearchList = () => {
  const { seriesId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const { data: players = [], isLoading, error } = usePlayersBySeries(seriesId);
  const deletePlayerMutation = useDeletePlayer();

  const handleDelete = (playerId) => {
    deletePlayerMutation.mutate(playerId);
  };

  const handleClickOpenAdd = () => setOpenAddModal(true);
  const handleCloseAdd = () => setOpenAddModal(false);

  const handleClickOpenEdit = (player) => {
    setSelectedPlayer(player);
    setOpenEditModal(true);
  };
  const handleCloseEdit = () => {
    setOpenEditModal(false);
    setSelectedPlayer(null);
  };

  if (isLoading) return <CircularProgress />;
  if (error) return <div>Error: {error.message}</div>;

  const filteredPlayers = players.filter((player) =>
    `${player.last_name} ${player.first_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      sx={{
        width: "100%",
        height: 400,
        bgcolor: "background.paper",
        borderRadius: 1,
        p: 1.5,
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
          options={filteredPlayers}
          getOptionLabel={(option) =>
            `${option.last_name} ${option.first_name}`
          }
          renderInput={(params) => (
            <TextField {...params} label="Поиск игрока" variant="outlined" />
          )}
          onChange={(event, value) => {
            if (value) {
              console.log(
                `Выбран игрок: ${value.first_name} ${value.last_name}`
              );
            } else {
              console.log("Очистка выбора");
            }
          }}
          onInputChange={(event, newInputValue) => setSearchTerm(newInputValue)}
        />
        <Button onClick={handleClickOpenAdd}>Добавить</Button>
      </Box>

      <FixedSizeList
        height={320}
        itemSize={80}
        itemCount={filteredPlayers.length}
        itemData={filteredPlayers}
      >
        {({ index, style, data }) => {
          const player = data[index];
          return (
            <ListItem style={style} key={index} sx={{ borderRadius: 1 }}>
              <ListItemButton onClick={() => handleClickOpenEdit(player)}>
                <ListItemAvatar>
                  <Avatar>{player.first_name[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${player.last_name} ${player.first_name}`}
                  secondary={`Рейтинг: ${player.rating}`}
                />
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(player.id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemButton>
            </ListItem>
          );
        }}
      </FixedSizeList>

      <AddPlayerModal open={openAddModal} handleClose={handleCloseAdd} />
      <EditPlayerProfileModal
        open={openEditModal}
        handleClose={handleCloseEdit}
        player={selectedPlayer}
      />
    </Box>
  );
};

export default PlayersSearchList;
