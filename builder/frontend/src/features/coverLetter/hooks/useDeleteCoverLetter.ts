import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteCoverLetter } from "../services/coverLetter.service";
import { COVER_LETTERS_QUERY_KEY } from "./useCoverLetters";

export const useDeleteCoverLetter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCoverLetter,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COVER_LETTERS_QUERY_KEY });
    },
  });
};
