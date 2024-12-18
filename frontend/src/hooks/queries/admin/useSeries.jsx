import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  getSeriesByUser,
  deleteSeriesById,
  createNewSeries,
  getSeriesById,
  changeSeriesById,
} from "../../../api/queries/apiSeries";

export const useGetSeries = () => {
  return useQuery({
    queryKey: ["user-series"],
    queryFn: () => getSeriesByUser(),
  });
};
export const useGetSeriesById = (id) => {
  return useQuery({
    queryKey: ["seriesById"],
    queryFn: () => getSeriesById(id),
  });
};

export const useDeleteSeries = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteSeriesById(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["user-series"]);
    },
  });
};
export const useCreateSeries = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newSeries) => createNewSeries(newSeries),
    onSuccess: () => {
      queryClient.invalidateQueries(["user-series"]);
    },
  });
};
export const useUpdateSeries = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => changeSeriesById(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["seriesById"]);
    },
  });
};
