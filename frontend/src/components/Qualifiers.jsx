import React from "react";
import { useParams } from "react-router-dom";
import { useGetGroups } from "../hooks/queries/useGroups";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";

export const processMatches = (groupsData) => {
  if (!Array.isArray(groupsData)) {
    console.error("Invalid groups data:", groupsData);
    return {};
  }

  const groups = {};

  groupsData.forEach((group) => {
    const groupName = group.group_name;
    if (!groups[groupName]) {
      groups[groupName] = {};
    }

    group.matches.forEach((match) => {
      const player1 = `${match.player_1.first_name} ${match.player_1.last_name}`;
      const player2 = `${match.player_2.first_name} ${match.player_2.last_name}`;

      if (!groups[groupName][player1]) {
        groups[groupName][player1] = { name: player1, matches: {} };
      }
      if (!groups[groupName][player2]) {
        groups[groupName][player2] = { name: player2, matches: {} };
      }

      groups[groupName][player1].matches[player2] = {
        score1: match.score_player_1,
        score2: match.score_player_2,
      };
      groups[groupName][player2].matches[player1] = {
        score1: match.score_player_2,
        score2: match.score_player_1,
      };
    });
  });

  return groups;
};

const Qualifiers = () => {
  const { tournamentId } = useParams();
  const { data, isLoading, error } = useGetGroups(tournamentId);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading matches</div>;

  const groups = processMatches(data);
  const hasGroupsWithPlayers = Object.keys(groups).some(
    (group) => Object.keys(groups[group]).length > 0
  );
  return (
    <>
      {hasGroupsWithPlayers && <Typography variant="h3">Отборочные</Typography>}
      <Box sx={{ overflowX: "auto", width: "100%" }}>
        {Object.keys(groups).map((group) => {
          const players = groups[group];
          const playerIds = Object.keys(players);
          if (playerIds.length === 0) {
            return null;
          }
          return (
            <Box key={group} sx={{ my: 1, width: "100%" }}>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {group}
              </Typography>
              <TableContainer component={Paper} sx={{ width: "100%" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Игроки</TableCell>
                      {playerIds.map((id) => (
                        <TableCell key={id}>{players[id].name}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {playerIds.map((id1) => (
                      <TableRow key={id1}>
                        <TableCell>{players[id1].name}</TableCell>
                        {playerIds.map((id2) => (
                          <TableCell key={id2}>
                            {id1 === id2
                              ? "-"
                              : `${
                                  players[id1].matches[id2]?.score1 ?? "N/A"
                                }:${
                                  players[id1].matches[id2]?.score2 ?? "N/A"
                                }`}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          );
        })}
      </Box>
    </>
  );
};
export default Qualifiers;
