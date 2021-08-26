export interface IScholarCard {
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
}
