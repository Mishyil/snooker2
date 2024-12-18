import React from "react";
import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import { useChangePlayer } from "../../../hooks/queries/usePlayers";

const EditPlayerProfileModal = ({ open, handleClose, player }) => {
  const [editedPlayer, setEditedPlayer] = useState({
    first_name: "",
    last_name: "",
    rating: "",
  });
  const changePlayerMutation = useChangePlayer();
  useEffect(() => {
    if (player) {
      setEditedPlayer(player);
    }
  }, [player]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPlayer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    handleClose();
    changePlayerMutation.mutate({ id: player.id, data: editedPlayer });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Настройки игрока</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="first_name"
          label="Имя"
          type="text"
          fullWidth
          value={editedPlayer.first_name || ""}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="last_name"
          label="Фамилия"
          type="text"
          fullWidth
          value={editedPlayer.last_name || ""}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="rating"
          label="Рейтинг"
          type="number"
          fullWidth
          value={editedPlayer.rating || ""}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Отмена
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPlayerProfileModal;
