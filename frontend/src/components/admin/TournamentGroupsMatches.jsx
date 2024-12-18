import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
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
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useGetGroups } from "../../hooks/queries/useGroups";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MatchDetailsModal from "./modal/MatchDetailsModal";

const TournamentGroupsMatches = () => {
  const { tournamentId } = useParams();
  const { data, isLoading, error } = useGetGroups(tournamentId);
  const [openModal, setOpenModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const handleOpenModal = (match, event) => {
    event.stopPropagation();
    setSelectedMatch(match);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedMatch(null);
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Матчи отборочных
      </Typography>
      {Array.isArray(data) && data.length > 0 ? (
        data.map((group, index) => (
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <Typography>{`Группа: ${group.group_name}`}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {group.matches.map((match, matchIndex) => (
                  <ListItem key={matchIndex}>
                    <ListItemText
                      primary={`Матч: ${match.player_1.first_name} ${match.player_1.last_name} vs ${match.player_2.first_name} ${match.player_2.last_name}`}
                      secondary={`Счет: ${match.score_player_1} - ${match.score_player_2}`}
                    />
                    <Button
                      variant="outlined"
                      onClick={(event) => handleOpenModal(match, event)}
                    >
                      Изменить
                    </Button>
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <Typography>Данные отсутствуют</Typography>
      )}
      <MatchDetailsModal
        open={openModal}
        handleClose={handleCloseModal}
        selectedMatch={selectedMatch}
      ></MatchDetailsModal>
    </Container>
  );
};

export default TournamentGroupsMatches;
