import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  getPlayoffByTournamentId,
  updateMatchDataByMatchId,
  updateStatusMatchByMatchId,
  createPlayoffByTournamentId,
  deletePlayoffByTournamentId,
  updatePlayoffPatricipantsByStageId,
  deletePlayoffPatricipantsByStageId,
  drawMatchesByStageId,
} from "../../api/queries/apiPlayoff";



export const useGetPlayOff = (id) => {
  return useQuery({
    queryKey: ["playoff"],
    queryFn: () => getPlayoffByTournamentId(id),
  });
};

export const useDestributeMatchData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateMatchDataByMatchId(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["playoff"]);
    },
  });
};
export const useChangeStatusMatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, stage_id, data }) =>
      updateStatusMatchByMatchId(id, stage_id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["playoff"]);
    },
  });
};
export const useCreateBracket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => createPlayoffByTournamentId(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["playoff"]);
    },
  });
};
export const useDeleteBracket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deletePlayoffByTournamentId(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["playoff"]);
    },
  });
};

export const useAddPlayersToStage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updatePlayoffPatricipantsByStageId(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["playersByTournamentId"]);
    },
  });
};
export const useDeletePlayersToStage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, playerId }) =>
      deletePlayoffPatricipantsByStageId(id, playerId),
    onSuccess: () => {
      queryClient.invalidateQueries(["playersByStage"]);
    },
  });
};
export const useDrawPlayers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => drawMatchesByStageId(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["playoff"]);
    },
  });
};
