import { useQuery } from "@tanstack/react-query";
import { fetchUserProjects } from "./api";

export const useUserProjects = (userId: string) => {
    return useQuery({
      queryKey: ['userProjects', userId],
      queryFn: () => fetchUserProjects(userId),
      enabled: !!userId, // Only run the query if userId is available
    });
  };

