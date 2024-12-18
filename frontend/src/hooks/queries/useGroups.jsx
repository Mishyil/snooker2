import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  getGroupsByTournamentId,
  createGroupByTournamentId,
  getGroupsDashByTournamentId,
  changeGroupByGroupId,
  deletePlayerByGroupId,
  deleteGroupById,
	createMatchesByTournamentId,
	changeGroupMatchByMatchId
} from "../../api/queries/apiGrops";

export const useGetGroups = (id) => {
  return useQuery({
    queryKey: ["groupsByTournament"],
    queryFn: () => getGroupsByTournamentId(id),
  });
};
export const useGetGroupsDash = (id) => {
  return useQuery({
    queryKey: ["groupsDashByTournament"],
    queryFn: () => getGroupsDashByTournamentId(id),
  });
};

export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => createGroupByTournamentId(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["groupsByTournament"]);
    },
  });
};
export const useChangeGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => changeGroupByGroupId(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["groupsByTournament"]);
    },
  });
};
export const useDeleteGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ groupId }) => deleteGroupById(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries(["groupsByTournament"]);
    },
  });
};

export const useDeleteGroupPlayer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, playerId }) => deletePlayerByGroupId(id, playerId),
    onSuccess: () => {
      queryClient.invalidateQueries(["groupsByTournament"]);
    },
  });
};
export const useCreateGroupMatches = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => createMatchesByTournamentId(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["groupsByTournament"]);
    },
  });
};
export const useChangeGroupMatches = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({id, data}) => changeGroupMatchByMatchId(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["groupsByTournament"]);
    },
  });
};
