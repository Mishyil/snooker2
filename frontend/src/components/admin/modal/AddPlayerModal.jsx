import React from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useCreatePlayer } from "../../../hooks/queries/usePlayers";

const AddPlayerModal = ({ open, handleClose }) => {
  const { seriesId } = useParams();
  const createPlayerMutation = useCreatePlayer();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    rating: 500,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createPlayerMutation.mutate({ id: seriesId, data: formData });
    handleClose();
    setFormData({
      first_name: "",
      last_name: "",
      rating: 500,
    });
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Добавить пользователя</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="first_name"
          label="Имя"
          type="text"
          fullWidth
          value={formData.first_name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="last_name"
          label="Фамилия"
          type="text"
          fullWidth
          value={formData.last_name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="rating"
          label="Рейтинг"
          type="number"
          fullWidth
          value={formData.rating}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Отмена
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPlayerModal;
