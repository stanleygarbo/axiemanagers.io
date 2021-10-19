import { ScholarReports } from ".././IResponseTypes";

export interface IReportsTable {
  reports?: ScholarReports;
  rank: number;
  mmr: number;
  totalSLP: number;
  totalToday: number;
  dailyAverage: { slp: string; converted: number | string };
}
