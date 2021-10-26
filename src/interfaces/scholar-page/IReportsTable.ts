import { ScholarReports } from ".././IResponseTypes";

export interface IReportsTable {
  reports?: ScholarReports;
  lastClaimed?: number;
  minQuota: number;
}
