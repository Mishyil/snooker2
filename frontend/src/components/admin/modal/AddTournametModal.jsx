import React from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useCreateTournamentsBySeriesId } from "../../../hooks/queries/useTournaments";

const AddTournametModal = ({ open, handleClose }) => {
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const { seriesId } = useParams();
  const createTournamentMutation = useCreateTournamentsBySeriesId();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTournament = { name, visible };
    createTournamentMutation.mutate({ id: seriesId, data: newTournament });
    setName("");
    handleClose();
  };
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <TextField
          label="Название турнира"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={visible}
              onChange={(e) => setVisible(e.target.checked)}
            />
          }
          label="Видимый"
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Создать
        </Button>
      </Box>
    </Modal>
  );
};

export default AddTournametModal;
