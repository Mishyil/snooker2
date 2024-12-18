import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  getTournamentsBySeriesId,
  getTournamentsById,
  getPlayersByTournamernt,
  createTournamentsBySeriesId,
  deleteTournamentsById,
  deletePlayerByTournamernt,
  addPlayersByTournamernt,
	changeTournamentsById,
	getTournamentsBySeriesIdDash
} from "../../api/queries/apiTournaments";

export const useGetTournamentsBySeriesId = (id) => {
  return useQuery({
    queryKey: ["tournamentsBySeries"],
    queryFn: () => getTournamentsBySeriesId(id),
  });
};



export const useGetTournamentsBySeriesIdDash = (id) => {
  return useQuery({
    queryKey: ["tournamentsBySeries"],
    queryFn: () => getTournamentsBySeriesIdDash(id),
  });
};
export const useCreateTournamentsBySeriesId = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => createTournamentsBySeriesId(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["tournamentsBySeries"]);
    },
  });
};
export const useChangeTournamentsBySeriesId = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => changeTournamentsById(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["tournamentsBySeries"]);
    },
  });
};
export const useDeleteTournamentsBySeriesId = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteTournamentsById(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["tournamentsBySeries"]);
    },
  });
};

export const useGetTournamentsById = (id) => {
  return useQuery({
    queryKey: ["tournamentsId"],
    queryFn: () => getTournamentsById(id),
  });
};
export const useGetPlayersByTournamentId = (id) => {
  return useQuery({
    queryKey: ["playersByTournamentId"],
    queryFn: () => getPlayersByTournamernt(id),
  });
};

export const useDeletePlayerByTournamentId = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, playerId }) => deletePlayerByTournamernt(id, playerId),
    onSuccess: () => {
      queryClient.invalidateQueries(["playersByTournamentId"]);
    },
  });
};
export const useAddPlayerByTournamentId = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => addPlayersByTournamernt(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["playersByTournamentId"]);
    },
  });
};
