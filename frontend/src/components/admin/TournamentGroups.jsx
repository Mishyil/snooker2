import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetPlayersByTournamentId } from "../../hooks/queries/useTournaments";
import { useGetGroupsDash } from "../../hooks/queries/useGroups";
import { useMutation } from "@tanstack/react-query";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Container,
  Modal,
  Box,
  CircularProgress,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import AddGroupModal from "./modal/AddGroupModal";
import AddPlayersToGroupModal from "./modal/AddPlayersToGroupModal";
import {
  useChangeGroup,
  useDeleteGroupPlayer,
  useDeleteGroup,
	useCreateGroupMatches
} from "../../hooks/queries/useGroups";

const TournamentGroups = () => {
  const { tournamentId } = useParams();
  const {
    data: players,
    isLoading: isLoadingPlayers,
    error: errorPlayers,
  } = useGetPlayersByTournamentId(tournamentId);
  const {
    data: groups,
    isLoading: isLoadingGroups,
    error: errorGroups,
  } = useGetGroupsDash(tournamentId);

  const [openModal, setOpenModal] = useState(false);
  const [openAddGroupModal, setOpenAddGroupModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const addPlayerMutation = useChangeGroup();

  const deletePlayerMutation = useDeleteGroupPlayer();

  const createMatchesMutation = useCreateGroupMatches();

  const deleteGroupMutation = useDeleteGroup();

  const handleOpenModal = (groupId) => {
    setSelectedOptions([]);
    setInputValue("");
    setSelectedGroupId(groupId);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedGroupId(null);
  };

  const handleOptionToggle = (option) => {
    setSelectedOptions((prevSelected) => {
      const isSelected = prevSelected.some(
        (selected) => selected.id === option.id
      );
      if (isSelected) {
        return prevSelected.filter((selected) => selected.id !== option.id);
      } else {
        return [...prevSelected, option];
      }
    });
  };

  const handleButtonClick = () => {
    const playerIds = selectedOptions.map((option) => option.id);
    addPlayerMutation.mutate({ id: selectedGroupId, data: playerIds });
    handleCloseModal();
  };

  const handleDeletePlayer = (memberId, groupId) => {
    deletePlayerMutation.mutate({ id: groupId, playerId: memberId });
  };

  const handleDeleteGroup = (groupId) => {
    deleteGroupMutation.mutate({ groupId: groupId });
  };
  const handleCreateMatches = () => {
    createMatchesMutation.mutate(tournamentId);
  };

  if (isLoadingPlayers || isLoadingGroups) {
    return <CircularProgress />;
  }

  if (errorPlayers || errorGroups) {
    const errorMessage = errorTournament
      ? errorPlayers.message
      : errorGroups.message;
    return <div>Error: {errorMessage}</div>;
  }

  return (
    <>
      <Container sx={{}}>
        <Typography variant="h4" gutterBottom>
          Группы отборочных
        </Typography>
        {groups.map((group, index) => (
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Typography>{group.name}</Typography>
                  <IconButton
                    color="error"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDeleteGroup(group.id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Button
                    variant="contained"
                    onClickCapture={(event) => {
                      event.stopPropagation();
                      handleOpenModal(group.id);
                    }}
                  >
                    Добавить игрока
                  </Button>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {group.players.map((member, idx) => (
                  <ListItem key={idx}>
                    <ListItemText
                      primary={`${member.first_name} ${member.last_name}`}
                    />
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeletePlayer(member.id, group.id)}
                    >
                      Удалить
                    </Button>
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              borderRadius: 1,
              width: 500,
              height: "50%",
              pb: 2,
            }}
          >
            <AddPlayersToGroupModal
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
              inputValue={inputValue}
              setInputValue={setInputValue}
              handleOptionToggle={handleOptionToggle}
              handleButtonClick={handleButtonClick}
              handleCloseModal={handleCloseModal}
              options={players}
            />
          </Box>
        </Modal>
      </Container>
      <Container sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenAddGroupModal(true)}
        >
          Добавить Группу
        </Button>
        <Button
          onClick={handleCreateMatches}
          variant="contained"
          color="primary"
        >
          Создать матчи
        </Button>
      </Container>
      <AddGroupModal
        open={openAddGroupModal}
        handleClose={() => setOpenAddGroupModal(false)}
      />
    </>
  );
};

export default TournamentGroups;
