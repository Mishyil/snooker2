import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useGetPlayOff } from "../hooks/queries/usePlayOff";
import { Box, Container } from "@mui/material";

const Playoff = () => {
  const { tournamentId } = useParams();
  const { data, isLoading, error } = useGetPlayOff(tournamentId);
  const containerRef = useRef(null);

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

  return (
    <>

      <Box sx={{width: '100%'}}>
        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error loading matches</div>
        ) : (
          <div
            ref={containerRef}
            id="brackets-container"
            className="brackets-viewer"
            style={{
              maxHeight: "800px", // Ограничение по высоте (можно изменить значение)
              overflowY: "auto", // Включение вертикальной прокрутки
            }}
          />
        )}
      </Box>
    </>
  );
};

export default Playoff;
