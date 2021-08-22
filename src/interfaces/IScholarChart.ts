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
  progress: number;
  chartData?: string[];
  chartLabels?: string[];
}
