import {createDestributeMatchRating} from '../../api/queries/apiRating'
import { useQueryClient, useMutation } from '@tanstack/react-query';


export const useDestributeMatchRating = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ match_type, id }) => createDestributeMatchRating(match_type, id),
    onSuccess: () => {
      queryClient.invalidateQueries(["playersBySeries"]);
    },
  });
};