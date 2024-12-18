import { useState } from "react";
import {
  Modal,
  Box,
  Button,
  TextField,
  MenuItem,
  Container,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useCreateGroup } from "../../../hooks/queries/useGroups";

const AddGroupModal = ({ open, handleClose }) => {
  const [groupName, setGroupName] = useState("");
  const { tournamentId } = useParams();
  const createGroupMutate = useCreateGroup();
  const handleAddGroup = () => {
    createGroupMutate.mutate({ id: tournamentId, data: groupName });
		handleClose()
		setGroupName('')
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
          width: 400,
        }}
      >
        <Container sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Название группы"
            value={groupName || ''}
            onChange={(e) => setGroupName(e.target.value)}
            variant="outlined"
            fullWidth
          ></TextField>
          <Button variant="contained" color="primary" onClick={handleAddGroup}>
            Добавить
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleClose}>
            Закрыть
          </Button>
        </Container>
      </Box>
    </Modal>
  );
};

export default AddGroupModal;
