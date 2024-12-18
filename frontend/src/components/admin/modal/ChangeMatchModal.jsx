import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  useDestributeMatchData,
  useChangeStatusMatch,
} from "../../../hooks/queries/usePlayOff";
import { useDestributeMatchRating } from "../../../hooks/queries/useRating";

const ChangeMatchModal = ({ open, onClose, match }) => {
  const [scoreOpponent1, setScoreOpponent1] = useState("");
  const [scoreOpponent2, setScoreOpponent2] = useState("");
  const [nameOpponent1, setNameOpponent1] = useState("");
  const [nameOpponent2, setNameOpponent2] = useState("");
  const [breakOpponent1, setBreakOpponent1] = useState("");
  const [breakOpponent2, setBreakOpponent2] = useState("");

  const handleScoreChange = (setter) => (event) => {
    setter(event.target.value);
  };
  const updataMatchDataMutation = useDestributeMatchData();
  const updateStatusMatchMutation = useChangeStatusMatch();
  const destributeMatchRatingMutation = useDestributeMatchRating();

  const handleCalculate = async () => {
    destributeMatchRatingMutation.mutate({
      match_type: "playoff",
      id: match.id,
    });
    onClose(true);
  };

  useEffect(() => {
    if (match) {
      setScoreOpponent1(match.opponent1.score || "");
      setScoreOpponent2(match.opponent2.score || "");
      setNameOpponent1(match.opponent1.name || "");
      setNameOpponent2(match.opponent2.name || "");
      setBreakOpponent1(match.opponent1.break_points || "");
      setBreakOpponent2(match.opponent2.break_points || "");
    }
  }, [match]);

  const handleChangeStatus = () => {
    updateStatusMatchMutation.mutate({
      id: match.id,
      stage_id: match.stage_id,
      data: { status: 4 },
    });
    onClose(true);
  };
  const handleSubmit = () => {
    updataMatchDataMutation.mutate({
      id: match.id,
      data: {
        opponent1: {
          id: match.opponent1.id,
          score: scoreOpponent1,
          name: nameOpponent1,
        },
        opponent2: {
          id: match.opponent2.id,
          score: scoreOpponent2,
          name: nameOpponent2,
        },
        breaks: [
          { player: match.opponent1.id, points: parseInt(breakOpponent1) || 0 },
          { player: match.opponent2.id, points: parseInt(breakOpponent2) || 0 },
        ],
      },
    });
    onClose(true);
    setScoreOpponent1("");
    setScoreOpponent2("");
    setBreakOpponent1("");
    setBreakOpponent2("");
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Данные матча</DialogTitle>
      <DialogContent>
        <div>
          <p>Match ID: {match?.id}</p>
          <TextField
            label={`Счет игрока: ${match?.opponent1?.name || "Неизвестно"}`}
            type="number"
            value={scoreOpponent1}
            onChange={handleScoreChange(setScoreOpponent1)}
            fullWidth
            margin="normal"
          />
          <TextField
            label={`Счет игрока: ${match?.opponent2?.name || "Неизвестно"}`}
            type="number"
            value={scoreOpponent2}
            onChange={handleScoreChange(setScoreOpponent2)}
            fullWidth
            margin="normal"
          />
        </div>
        <TextField
          label={`Брейк игрока: ${match?.opponent1?.name || "Неизвестно"}`}
          type="number"
          value={breakOpponent1}
          onChange={(e) => setBreakOpponent1(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label={`Брейк игрока: ${match?.opponent2?.name || "Неизвестно"}`}
          type="number"
          value={breakOpponent2}
          onChange={(e) => setBreakOpponent2(e.target.value)}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        {match?.status == 4 && match?.points_distributed == false && (
          <Button onClick={handleCalculate} color="primary" variant="contained">
            Расчитать очки
          </Button>
        )}
        {match?.points_distributed == true && (
          <Button disabled color="primary" variant="contained">
            Очки расчитаны
          </Button>
        )}
        {((match?.opponent1?.score || match?.opponent2?.score ) && (match?.status != 4) ) && (
          <Button
            onClick={handleChangeStatus}
            color="primary"
            variant="contained"
          >
            Завершить матч
          </Button>
        )}
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Сохранить
        </Button>
        <Button onClick={onClose} color="primary">
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeMatchModal;
