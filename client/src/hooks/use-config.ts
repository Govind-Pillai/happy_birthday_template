import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

// Define the response type manually based on the schema since we can't import the schema directly for type inference in this specific setup easily without shared package setup being perfect, 
// but we will use the runtime check from the route definition if we could.
// For now, we trust the API contract.

export interface Gift {
  id: string;
  label: string;
  content: string;
  image?: string;
}

export interface AppConfig {
  recipientName: string;
  targetDate: string;
  birthdayMessage: string;
  senderEmail: string;
  gifts: Gift[];
}

export function useConfig() {
  return useQuery({
    queryKey: [api.config.get.path],
    queryFn: async () => {
      const res = await fetch(api.config.get.path);
      if (!res.ok) throw new Error("Failed to fetch config");
      // In a real app we'd parse with Zod here, but for now we trust the backend
      return (await res.json()) as AppConfig;
    },
  });
}
