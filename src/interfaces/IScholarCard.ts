import { UseMutationResult } from "react-query";

export interface IScholarCard {
  ronin: string;
  name: string;
  earned: number;
  badge?: {
    id: string;
    name: string;
  };
  color: string;
  lastClaim: string;
  nextClaim: string;
  lastUpdated: string;
  progress: number | null;
  chartData?: string[];
  chartLabels?: string[];
  today?: string;
  error?: boolean;
  refetchScholarMutation: UseMutationResult<any, unknown, string, unknown>;
  showRetry: boolean;
}
