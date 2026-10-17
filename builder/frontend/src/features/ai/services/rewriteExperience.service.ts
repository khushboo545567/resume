import { useMutation } from "@tanstack/react-query";
import api from "../../../api/axios";

export const useRewriteExperience = () => {
  return useMutation({
    mutationFn: async ({
      experience,
      targetRole,
    }: {
      experience: string;
      targetRole: string;
    }) => {
      const { data } = await api.post("/ai/rewrite-experience", {
        experience,
        targetRole,
      });

      return data.content;
    },
  });
};

