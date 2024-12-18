import React from "react";
import {
  Modal,
  Container,
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import Participants from "./Participants";
import { useDrawPlayers } from "../../../hooks/queries/usePlayOff";
import { useParams } from "react-router-dom";
const BracketParticipantModal = ({ open, match, handleClose }) => {
  const drawPlayersMutation = useDrawPlayers();
  const { tournamentId } = useParams();
  const handleCreatePlayoffMatches = () => {
    drawPlayersMutation.mutate(tournamentId);
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
          width: 600,
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
            Участники сетки
          </Typography>

          <Participants />
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
              variant="contained"
              color="primary"
              onClick={handleCreatePlayoffMatches}
            >
              Жеребьевка
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

export default BracketParticipantModal;
