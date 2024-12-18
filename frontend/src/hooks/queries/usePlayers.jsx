import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  getPlayersBySeries,
  createPlayersBySeriesId,
  deletePlayerById,
	changePlayerById
} from "../../api/queries/apiPlayers";
import { getPlayoffPatricipantsByStageId } from "../../api/queries/apiPlayoff";

export const usePlayersBySeries = (id) => {
  return useQuery({
    queryKey: ["playersBySeries"],
    queryFn: () => getPlayersBySeries(id),
  });
};

export const usePlayersByTournament = (id) => {
  return useQuery({
    queryKey: ["playersByTournament"],
    queryFn: () => getPlayersBySeries(id),
  });
};
export const usePlayersByStage = (id) => {
  return useQuery({
    queryKey: ["playersByStage"],
    queryFn: () => getPlayoffPatricipantsByStageId(id),
  });
};

export const useCreatePlayer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => createPlayersBySeriesId(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["playersBySeries"]);
    },
  });
};
export const useChangePlayer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => changePlayerById(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["playersBySeries"]);
    },
  });
};
export const useDeletePlayer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deletePlayerById(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["playersBySeries"]);
    },
  });
};
