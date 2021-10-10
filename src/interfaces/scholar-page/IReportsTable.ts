import { ChartObj } from ".././IResponseTypes";

export interface IReportsTable {
  reports: ChartObj[];
  rank: number;
  mmr: number;
  totalSLP: number;
  totalToday: number;
  dailyAverage: { slp: string; converted: number | string };
}
