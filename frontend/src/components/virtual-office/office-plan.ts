import type { Agent } from "@/types/agents";

export const OFFICE_ROOMS = ["research", "operations", "studio", "meeting"] as const;
export type OfficeRoom = (typeof OFFICE_ROOMS)[number];

export interface OfficeEmployees {
  agents: Agent[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}
