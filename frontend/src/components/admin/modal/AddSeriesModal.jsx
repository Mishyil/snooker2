import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useCreateSeries } from "../../../hooks/queries/admin/useSeries";

const AddSeriesModal = ({ open, handleClose }) => {
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const createSeriesMutation = useCreateSeries();
  const handleSubmit = () => {
    const newSeries = { name, visible };
    createSeriesMutation.mutate(newSeries);
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
          borderRadius: 1,
        }}
      >
        <TextField
          label="Название серии"
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
          label="Видимый для всех"
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Создать
        </Button>
      </Box>
    </Modal>
  );
};

export default AddSeriesModal;
