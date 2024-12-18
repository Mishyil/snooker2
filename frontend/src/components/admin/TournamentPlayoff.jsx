import React from "react";
import { useParams } from "react-router-dom";
import { useGetPlayOff } from "../../hooks/queries/usePlayOff";
import {
  CircularProgress,
  Container,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { useState, useRef, useEffect } from "react";
import ChangeMatchModal from "./modal/ChangeMatchModal";
import CreateBracketModal from "./modal/CreateBracketModal";
import BracketParticipantModal from "./modal/BracketParticipantModal";

const TournamentPlayoff = () => {
  const { tournamentId } = useParams();
  const { data = [], isLoading, error } = useGetPlayOff(tournamentId);
  const containerRef = useRef(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const [createPlayoffmatchesModal, setCreatePlayoffmatchesModal] =
    useState(false);

  const [bracketParticipant, setBracketParticipant] = useState(false);
  const [showParticipantButton, setShowParticipantButton] = useState(false);
  const handleMatchClick = (match) => {
    setSelectedMatch(match);
    setOpenModal(true);
  };
  useEffect(() => {
    const initializeBracketsViewer = () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      if (window.bracketsViewer && containerRef.current && data) {
        window.bracketsViewer.render(
          {
            stages: data.stage,
            matches: data.match,
            matchGames: data.match_game,
            participants: data.participant,
          },
          {
            selector: `#${containerRef.current.id}`,
            participantOriginPlacement: "before",
            separatedChildCountLabel: false,
            showSlotsOrigin: false,
            showLowerBracketSlotsOrigin: true,
            highlightParticipantOnHover: true,
          }
        );
      }
    };

    if (document.readyState === "complete") {
      initializeBracketsViewer();
    } else {
      window.addEventListener("load", initializeBracketsViewer);
      return () => window.removeEventListener("load", initializeBracketsViewer);
    }
  }, [data]);

  useEffect(() => {
    if (window.bracketsViewer) {
      window.bracketsViewer.onMatchClicked = handleMatchClick;
    }
  }, [data]);

  return (
    <>
      <Container>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
          }}
        >
          <Typography variant="h4">Сетка плей-оффа</Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {data.participant && (
              <Button
                variant="contained"
                onClick={() => setBracketParticipant(true)}
              >
                Участники сетки
              </Button>
            )}
            <Button
              variant="contained"
              onClick={() => setCreatePlayoffmatchesModal(true)}
            >
              Настройки сетки
            </Button>
          </Box>
        </Box>
        <CreateBracketModal
          open={createPlayoffmatchesModal}
          handleClose={() => setCreatePlayoffmatchesModal(false)}
        />
        <BracketParticipantModal
          open={bracketParticipant}
					match={selectedMatch}
          handleClose={() => setBracketParticipant(false)}
        />
      </Container>
      <Container>
        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div></div>
        ) : (
          <div
            ref={containerRef}
            id="brackets-container"
            className="brackets-viewer"
            style={{
              maxHeight: "800px",
              overflowY: "auto",
              borderRadius: 1,
            }}
          />
        )}
        <ChangeMatchModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          match={selectedMatch}
        />
      </Container>
    </>
  );
};

export default TournamentPlayoff;
