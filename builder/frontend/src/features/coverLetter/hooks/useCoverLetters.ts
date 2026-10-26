import { useQuery } from "@tanstack/react-query";

import { getCoverLetters } from "../services/coverLetter.service";

export const COVER_LETTERS_QUERY_KEY = ["cover-letters"];

export const useCoverLetters = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: COVER_LETTERS_QUERY_KEY,
    queryFn: getCoverLetters,
  });

  return {
    coverLetters: data ?? [],
    loading: isLoading,
    isError,
  };
};
