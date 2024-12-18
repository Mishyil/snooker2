import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Modal,
  FormControl,
  Select,
  MenuItem,
  Button,
  TextField,
  InputLabel,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useChangeGroupMatches } from "../../../hooks/queries/useGroups";
import { useDestributeMatchRating } from "../../../hooks/queries/useRating";

const MatchDetailsModal = ({ open, handleClose, selectedMatch }) => {
  const [matchDetails, setMatchDetails] = useState({
    score_player_1: 0,
    score_player_2: 0,
    winner: null,
    points_distributed: false,
    pointsDistributionType: "option1",
  });

  useEffect(() => {
    if (selectedMatch) {
      setMatchDetails({
        score_player_1: selectedMatch.score_player_1,
        score_player_2: selectedMatch.score_player_2,
        winner: selectedMatch.winner,
        points_distributed: selectedMatch.points_distributed,
        pointsDistributionType:
          selectedMatch.pointsDistributionType || "option1",
      });
    } else {
      setMatchDetails({
        score_player_1: 0,
        score_player_2: 0,
        winner: null,
        points_distributed: false,
        pointsDistributionType: "option1",
      });
    }
  }, [selectedMatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMatchDetails((prevDetails) => ({
      ...prevDetails,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const changeMatchMutation = useChangeGroupMatches();
  const destributeRationMutation = useDestributeMatchRating();
  const handleSaveChanges = () => {
    changeMatchMutation.mutate({ id: selectedMatch.id, data: matchDetails });
    handleClose();
  };

  const handleCalculate = async () => {
    destributeRationMutation.mutate({
      match_type: "qualifiers",
      id: selectedMatch.id,
    });
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
          p: 4,
          borderRadius: 1,
        }}
      >
        <Typography variant="h6" gutterBottom>
          {selectedMatch
            ? `Матч: ${selectedMatch.player_1.first_name} ${selectedMatch.player_1.last_name} vs ${selectedMatch.player_2.first_name} ${selectedMatch.player_2.last_name}`
            : ""}
        </Typography>
        <form>
          <Typography variant="body1" gutterBottom>
            Счет игрока 1
          </Typography>
          <TextField
            type="number"
            name="score_player_1"
            value={matchDetails.score_player_1}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Typography variant="body1" gutterBottom>
            Счет игрока 2
          </Typography>
          <TextField
            type="number"
            name="score_player_2"
            value={matchDetails.score_player_2}
            onChange={handleChange}
            fullWidth
          />
          <Typography variant="body1" gutterBottom>
            Победитель
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel>Выберите победителя</InputLabel>
            <Select
              name="winner"
              value={matchDetails.winner || ""}
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>Выберите победителя</em>
              </MenuItem>
              {selectedMatch && [
                <MenuItem
                  key={selectedMatch.player_1.id}
                  value={selectedMatch.player_1.id}
                >
                  {selectedMatch.player_1.first_name}{" "}
                  {selectedMatch.player_1.last_name}
                </MenuItem>,
                <MenuItem
                  key={selectedMatch.player_2.id}
                  value={selectedMatch.player_2.id}
                >
                  {selectedMatch.player_2.first_name}{" "}
                  {selectedMatch.player_2.last_name}
                </MenuItem>,
              ]}
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                name="points_distributed"
                checked={matchDetails.points_distributed}
                onChange={handleChange}
                disabled
              />
            }
            label="Очки"
          />
          {/* <Box sx={{ mt: 1, display: "flex", justifyContent: "flex-end" }}> */}
          <Button
            variant="contained"
            onClick={() => handleCalculate(selectedMatch.id)}
          >
            Распределить очки
          </Button>
          {/* </Box> */}
        </form>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveChanges}
          >
            Сохранить изменения
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClose}
            sx={{ ml: 1 }}
          >
            Отмена
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default MatchDetailsModal;
