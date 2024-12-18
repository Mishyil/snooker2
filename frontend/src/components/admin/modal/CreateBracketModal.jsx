import React from "react";
import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Modal,
  Container,
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import {
  useCreateBracket,
  useDeleteBracket,
} from "../../../hooks/queries/usePlayOff";

const CHOICES = [
  { name: "1x2", value: 4 },
  { name: "1x4", value: 8 },
  { name: "1x8", value: 16 },
  { name: "1x16", value: 32 },
  { name: "1x32", value: 64 },
  { name: "1x64", value: 128 },
  { name: "1x128", value: 256 },
];

const TYPE = [
  { name: "Обычная", value: "single_elimination" },
  { name: "С двойным выбыванием", value: "double_elimination" },
];

const CreateBracketModal = ({ open, handleClose }) => {
  const containerRef = useRef(null);
  const { tournamentId } = useParams();
  const [playoffSize, setPlayoffSize] = useState(4);
  const [playoffType, setPlayoffType] = useState("single_elimination");
  const [bracketSize, setBracketSize] = useState("");

  const createBracketMutation = useCreateBracket();
  const deleteBracketMutation = useDeleteBracket();
  const handleCreatePlayoffMatches = () => {
    createBracketMutation.mutate({
      id: tournamentId,
      data: { tournament_type: playoffType, size: playoffSize },
    });
    handleClose();
  };

  const handleDeleteBracket = () => {
    deleteBracketMutation.mutate(tournamentId);
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }
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
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 2,
          borderRadius: 1,
          width: 400,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            width: "100%",
            pt: 0,
          }}
        >
          <Typography variant="h5" sx={{ m: 1 }}>
            Выберите размер сетки
          </Typography>
          <TextField
            select
            label=""
            value={playoffSize}
            onChange={(e) => setPlayoffSize(e.target.value)}
            variant="outlined"
            fullWidth
          >
            {CHOICES.map((option) => (
              <MenuItem key={option.name} value={option.value}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
          <Typography variant="h5" sx={{ m: 1 }}>
            Выберите тип сетки
          </Typography>
          <TextField
            select
            label=""
            value={playoffType}
            onChange={(e) => setPlayoffType(e.target.value)}
            variant="outlined"
            fullWidth
          >
            {TYPE.map((option) => (
              <MenuItem key={option.name} value={option.value}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 1,
            }}
          >
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleDeleteBracket}
            >
              Удалить сетку
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreatePlayoffMatches}
            >
              Создать
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleClose}>
              Закрыть
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateBracketModal;
