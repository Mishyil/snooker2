import { useQuery } from "@tanstack/react-query";
import { getSeries, deleteSeriesById } from "../../api/queries/apiSeries";

export const useGetSeries = () => {
  return useQuery({
    queryKey: ["series"],
    queryFn: getSeries,
  });
};

